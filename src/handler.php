<?php


namespace App\Http\Controllers\Auth;

use \GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class SSOController extends Controller
{
    /**
     * Function to Redirect a user to VATSIM Connect for Authentication
     *
     * @return Redirect
     */
    public function login()
    {
        session()->forget('state');
        session()->forget('token');
        session()->put('state', $state = \Str::random(40));

        $query = http_build_query([
            'client_id' => env('SSO_CLIENT_ID'),
            'redirect_uri' => env('SSO_REDIRECT_URI'),
            'response_type' => 'code',
            'scope' => env('SSO_SCOPE'),
            'state' => $state,
        ]);

        return redirect(env('SSO_BASE_URL') . '/oauth/authorize?' . $query);

    }

    /**
     * Function to handle the return from VATSIM and request a access token
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     * @var request $request
     *
     */
    public function callback(Request $request)
    {
        $http = new Client;
        try {
            $response = $http->post(env('SSO_BASE_URL') . '/oauth/token', [
                'form_params' => [
                    'grant_type' => 'authorization_code',
                    'client_id' => env('SSO_CLIENT_ID'),
                    'client_secret' => env('SSO_SECRET'),
                    'redirect_uri' => env('SSO_REDIRECT_URI'),
                    'code' => $request->code,
                ],
            ]);
        } catch (ClientException $e) {
            return view('exceptions.sso', ['message' => $e->getResponse()->getBody()]);
        }
        session()->put('token', json_decode((string)$response->getBody(), true));
        try {
            $response = (new Client)->get(env('SSO_BASE_URL') . '/api/user', [
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer ' . session()->get('token.access_token')
                ]
            ]);
        } catch (ClientException $e) {
            return view('exceptions.sso', ['message' => $e->getResponse()->getBody()]);
        }
        $response = json_decode($response->getBody());

        if (!isset($response->data->cid)) {
            abort(500);
        }

        $user =
            User::updateOrCreate([
                'cid' => $response->data->cid,
            ],
                [
                    'first_name' => $response->data->personal->name_first,
                    'last_name' => $response->data->personal->name_last,
                    'email' => $response->data->personal->email,
                    'rating' => $response->data->vatsim->rating->id,
                    'prating' => $response->data->vatsim->pilotrating->id,
                ]);

        try {
            Auth::login($user);
        } catch (ClientException $e) {
            return view('exceptions.sso', ['message' => $e->getResponse()->getBody()]);
        }

        return redirect()->intended(route('index'));
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('index');
    }
}