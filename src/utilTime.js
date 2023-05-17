export const convertTime12to24 = (time12h) => {
    let timePstOutput = 0;
    if (time12h.length === 10){
        let [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':')
        
        if (hours === '12' && modifier === 'AM') {
            hours = '00';
            timePstOutput = `${hours}${minutes}`
        } 
        else if (parseInt(hours) < 10 && (modifier === 'A' ||modifier === 'AM') ){
            timePstOutput = `0${hours}${minutes}`   
        } else if (parseInt(hours) >= 10 && (modifier === 'A' ||modifier === 'AM')){
            timePstOutput = `${hours}${minutes}`
        } else if (parseInt(hours) === 12 && (modifier === 'P' ||modifier === 'PM')){
            timePstOutput = `12${minutes}`
        } else {
            hours = parseInt(hours) + 12;
            timePstOutput = `${hours}${minutes}`
        }
    } 
return timePstOutput

}