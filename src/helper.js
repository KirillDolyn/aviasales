export function ticketNorma(arrObjTicket) {
   
   function priceNorma(price) {
        return price
         .toString()
         .split("")
         .reverse()
         .reduce((argigation, char, i) => {
         if (i % 3 === 0) {
           return argigation + " " + char;
         }
         return argigation + char;
     }, "p ")
         .split("")
         .reverse()
         .join("")
    }

    function timeOutIn (date, time) {
        let dateOut = new Date(date)
        const outHours = dateOut.getHours() 
        const outMinutes = dateOut.getMinutes()
        const inHours = new Date(
            dateOut.setHours(dateOut.getHours() + Math.ceil(time / 60))).getHours()
        const inMinutes = new Date(dateOut.setMinutes(dateOut.getMinutes() + time)).getMinutes()
        return  outHours + ":" + outMinutes + "-" + inHours + ":" + inMinutes
    }

    function outTime(duration) {
        return Math.ceil(duration / 60) + ":" + (duration / 60)
    }

    function stops(Stops) {
        switch (Stops) {
            case 0:
                return "Без пересадок";
            case 1:
                return "1 пересадка";    
            default:
                return `${Stops} пересадки`
        }
    }

    function outIn(arrOutIn) {
        return arrOutIn.map((road) => {
          return {
            id: road.date,
            out: `${road.origin} - ${road.destination}`,
            outTime: timeOutIn(road.date, road.duration),
            timeIn: outTime(road.duration),
            stops: stops(road.stops.length),
            stopsC: road.stops.join(", ")
          };
        });
    }
    return arrObjTicket.map((ticket) => {
        return {
            id: ticket.segments[0].date + ticket.segments[1].date,
            price: priceNorma(ticket.price),
            carrier: `//pics.avs.io/99/36/${ticket.carrier}.png`,
            segments: outIn(ticket.segments)
        }
    })
}

        
   
