const requestURL = 'http://26.245.229.110:8000'
let xhr = new XMLHttpRequest();
let id = 0
let InfoButton = document.querySelector(".card")
console.log(InfoButton)
InfoButton.onclick = function(evt){
    let divInfo = document.querySelector(".info")
    xhr.open('GET', requestURL + '/test');
    xhr.onload = () => {
        let a = JSON.parse(xhr.response)
        let info = JSON.stringify(a).split(":")[1]
        info = info.slice(1, info.length - 2)
        console.log(info)
        divInfo.textContent = info
    divInfo.classList.remove("hidden")
    }
    
    xhr.send()
}