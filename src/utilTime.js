
        // EVENTUALLY DELETE
        // else if (modifier === 'PM') {    
        //     hours = parseInt(hours) + 12;
        //     //console.log(hours, minutes, secs)
        //     timePstOutput = `${hours}${minutes}`
        // } 

export const convertTime12to24 = (time12h) => {
    let timePstOutput = 0;
    if (time12h.length === 10){
        let [time, modifier] = time12h.split(' ');
        //console.log('length = 10');
        //console.log("time", time, "modifier", modifier)
        let [hours, minutes, secs] = time.split(':')
        
        if (hours === '12' && modifier === 'AM') {
            hours = '00';
            timePstOutput = `${hours}${minutes}`
        } 
        else if (parseInt(hours) < 10 && (modifier === 'A' ||modifier === 'AM') ){
            timePstOutput = `0${hours}${minutes}`   
        } else if (parseInt(hours) >= 10 && (modifier === 'A' ||modifier === 'AM')){
            timePstOutput = `${hours}${minutes}`
        } else if (parseInt(hours) == 12 && (modifier === 'P' ||modifier === 'PM')){
            timePstOutput = `12${minutes}`
        } else {
            hours = parseInt(hours) + 12;
            timePstOutput = `${hours}${minutes}`
        }
        //console.log(timePstOutput)
    } //else {
    //         let [time, modifier] = time12h.split(' ');
    //         let [hours, minutes, secs] = modifier.split(':')
    //         console.log('length = 11')
    //         if (hours === '12' && modifier === 'AM') {
    //             hours = '00';
    //             timePstOutput = `${hours}${minutes}`
    //         } if (modifier === 'PM') {
    //             hours = parseInt(hours) + 12;
    //             //console.log(hours, minutes, secs)
    //             timePstOutput = `${hours}${minutes}`
    //         } else {
    //             timePstOutput = `${hours}${minutes}`
    //         }
    //         //console.log(timePstOutput)
    // }
return timePstOutput

}