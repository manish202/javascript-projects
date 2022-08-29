const setClock = (eh,em,es,h,m,s) => {
    if(h < 10){ h = "0" + h}
    if(m < 10){ m = "0" + m}
    if(s < 10){ s = "0" + s}
    eh.innerText = h;
    em.innerText = m;
    es.innerText = s;
}
//clock
let dh = document.getElementById("dh");
let dm = document.getElementById("dm");
let ds = document.getElementById("ds");
let ah = document.getElementById("ah");
let am = document.getElementById("am");
let as = document.getElementById("as");
setInterval(() => {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    if(h > 12){ h = h - 12}

    ah.style.transform = `rotate(${(h * 30) + (m/2)}deg)`;
    am.style.transform = `rotate(${m * 6}deg)`;
    as.style.transform = `rotate(${s * 6}deg)`;

    setClock(dh,dm,ds,h,m,s);
},1000);

//alarm
let alh = document.getElementById("alh");
let alm = document.getElementById("alm");
let als = document.getElementById("als");
let set = document.getElementById("set_alarm");
let reset = document.getElementById("reset_alarm");
let alarm_inp = document.getElementById("alarm");
let alrm_counter = document.getElementById("alrm-left");
const getNow = ({hr,mn,ss,tilltime}) => {
    //return current or future information
    let now = new Date();
    if(hr !== undefined){now.setHours(hr)}
    if(mn !== undefined){now.setMinutes(mn)}
    if(ss !== undefined){now.setSeconds(ss)}
    if(tilltime !== undefined){now.setTime(tilltime)}
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let milliseconds = now.getMilliseconds();
    let full_time = now.getTime();
    return {hour,minutes,seconds,milliseconds,full_time};
}
let counter_interval;
const startCountDown = (future,t1,t2,t3,counter,setelem,resetelem) => {
    counter_interval = setInterval(() => {
        let {full_time} = getNow({});
        if(full_time >= future){
            clearInterval(counter_interval);
            alert("your alarm is ringing silently");
            counter.classList.add("d-none");
            setelem.classList.remove("d-none");
            resetelem.classList.add("d-none");
        }else{
            // 19800000 means 5 hours 30 minutes
            let {hour:h,minutes:m,seconds:s} = getNow({tilltime: future - full_time - 19800000});
            setClock(t1,t2,t3,h,m,s);
        }
    }, 900);
}
let {hour,minutes} = getNow({});
if(hour.toString().length == 1){hour = "0"+hour}
if(minutes.toString().length == 1){minutes = "0"+minutes}
alarm_inp.value = hour + ":" + minutes;
set.addEventListener("click",() => {
    let cur = getNow({});
    let [hr,mn] = alarm_inp.value.split(":");
    let {full_time} = getNow({hr,mn,ss:00});
    if(cur.full_time > full_time){
        alert("set future time in alarm.");
    }else if((cur.full_time + 60000) > full_time){
        alert("please set alarm more then one minute from current time");
    }else{
        alrm_counter.classList.remove("d-none");
        startCountDown(full_time,alh,alm,als,alrm_counter,set,reset);
        set.classList.add("d-none");
        reset.classList.remove("d-none");
    }
});
reset.addEventListener("click",() => {
    alrm_counter.classList.add("d-none");
    clearInterval(counter_interval);
    set.classList.remove("d-none");
    reset.classList.add("d-none");
});

//stopwatch
let swm = document.getElementById("swm");
let sws = document.getElementById("sws");
let swms = document.getElementById("swms");
let start_stopwatch = document.getElementById("start_stopwatch");
let stop_watch = document.getElementById("stop_watch");
let reset_watch = document.getElementById("reset_watch");
let stopwatch_interval;
let stopWatchObj = {
    st_minutes:0,
    st_seconds:0,
    st_milliseconds:0
}
const stopWatch = ({st_minutes,st_seconds,st_milliseconds}) => {
    stopwatch_interval = setInterval(() => {
        st_milliseconds = st_milliseconds + 1
        if(st_milliseconds >= 99){st_milliseconds = 0; st_seconds += 1}
        if(st_seconds > 59){st_seconds = 0; st_minutes += 1}
        if(st_minutes > 59){clearInterval(stopwatch_interval); alert("stopwatch running from more then 1 hour.")}
        stopWatchObj = {st_minutes,st_seconds,st_milliseconds};
        setClock(swm,sws,swms,st_minutes,st_seconds,st_milliseconds);
    },10);
}
start_stopwatch.addEventListener("click",() => {
    stopWatch(stopWatchObj);
    start_stopwatch.classList.add("d-none");
    start_stopwatch.nextElementSibling.classList.remove("d-none");
});
stop_watch.addEventListener("click",() => {
    let task = stop_watch.innerHTML;
    if(task == "stop"){
        stop_watch.innerHTML = "resume";
        clearInterval(stopwatch_interval);
    }else{
        stop_watch.innerHTML = "stop";
        stopWatch(stopWatchObj);
    }
});
reset_watch.addEventListener("click",() => {
    clearInterval(stopwatch_interval);
    setClock(swm,sws,swms,00,00,00);
    start_stopwatch.classList.remove("d-none");
    start_stopwatch.nextElementSibling.classList.add("d-none");
    stop_watch.innerHTML = "stop";
    stopWatchObj = {
        st_minutes:0,
        st_seconds:0,
        st_milliseconds:0
    }
})