import { useEffect, useState } from 'react';

export default function UtilAdminRole() {

    const [isAdminRole, setIsAdminRole] = useState(false)
    var token = localStorage.getItem('token');
    //console.log("run is admin function... token is ", token)
    const mongoIsAdminURL = "https://zsebrief-backend-production.up.railway.app/login/isadmin" //PRODUCTION
    //const mongoIsAdminURL = "http://localhost:3000/login/isadmin" //TEST URL

    useEffect(() => {
        const fetchData = async () => {
            
            fetch(mongoIsAdminURL, {
            method:'POST', 
            headers:  {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Set the Authorization header with the token
                },
            }).then(response=> response.json()
            ).then(data=>{
                // console.log("returned data is ", data.admin)
                if (data.admin === false) {
                    setIsAdminRole(false)
                } else {
                    setIsAdminRole(true)
                }
                
            }).catch (error => {
                console.error('An error occurred:', error);
            })
        }
        fetchData()

    }, [token]);

    return isAdminRole

}
