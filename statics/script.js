function setButton(relay,status){
    let input = $("#relay"+relay);
    if(status == 'off'){
        input.attr("checked",false);
        // input.removeAttr('checked') 
    } else if(status == 'on') {
        input.attr("checked",true);
    }
    // console.log(
    //     $('#relay1').is(":checked") == $('#relay2').is(":checked"),
    //     $('#relay2').is(":checked") == $('#relay3').is(":checked"),
    //     $('#relay3').is(":checked") == $('#relay4').is(":checked"),
    //     $('#relay4').is(":checked") != $('#relayAll').is(":checked"),
    //     '=',
    //     $('#relay1').is(":checked") == $('#relay2').is(":checked") && $('#relay2').is(":checked") == $('#relay3').is(":checked") && $('#relay3').is(":checked") == $('#relay4').is(":checked") && $('#relay4').is(":checked") != $('#relayAll').is(":checked")
    // )

    if($('#relay1').is(":checked") == $('#relay2').is(":checked") && $('#relay2').is(":checked") == $('#relay3').is(":checked") && $('#relay3').is(":checked") == $('#relay4').is(":checked") && $('#relay4').is(":checked") != $('#relayAll').is(":checked")){
        // console.log('force #relayAll',"all-checked:" + $('#relay1').is(":checked"))
        console.log('force #relayAll',"parent click" )
        $("#relayAll").parent().trigger("click")
    // } else {
    //     console.warn('force #relayAll',"checked:false" )
    //     $("#relayAll").attr("checked",false);
        // $("#relayAll").removeAttr('checked')
    }
}
function toggleButton(relay) {
    let r = $('#relay'+relay).is(":checked") ? 'on' : 'off' ;
    // console.log(
    //     '  call',
    //     "API/relay/"+relay+"/"+r
    // );
    $.get( "API/relay/"+relay+"/"+r, function( data ) {
        setButton(data[0].Relay,data[0].state);
        // console.log(
        //     data[0]
        // );
    });
}
function toggleAll(rNum) {
    let rAll = $("#relayAll")
    rNum.forEach(function(relay){
        let rChild = $('#relay'+relay)
        // console.log(
        //     relay + '('+rChild.is(":checked") + ') != global(' + rAll.is(":checked") +')'
        // );
        if (rAll.is(":checked") != rChild.is(":checked")){
            // console.log(
            //     '   On synchronise #relay'+relay+' a '+rAll.is(":checked")
            // )
            // rChild.attr("checked",rAll.is(":checked"));
            // if(rChild.parent().is("span")){
                rChild.parent().trigger("click")
            // } else {
            //     rChild.trigger("click")
            // }
            // console.log(
            //     '       Verification',
            //     relay + '('+rChild.is(":checked") + ') != global(' + rAll.is(":checked") +')'
            // );
        }
    })
}
function toggleCron() {
    let r = $('#relayCron').is(":checked") ? 'on' : 'off' ;

    $.get( "API/cron/"+r, function( data ) {
        setButton('Cron',r);
    });
    if (r == 'on'){
        // console.log('setInterval',"API/relay");
        TimeInterval = setInterval(function(){
            $.get( "API/relay", function( data ) {
                data.forEach(function(relay){
                    // console.log(relay.Relay,relay.state)
                    setButton(relay.Relay,relay.state);
                });
            });
        }, 1000);
    } else {
        // console.warn('clearInterval');
        clearInterval(TimeInterval);
    }

}

