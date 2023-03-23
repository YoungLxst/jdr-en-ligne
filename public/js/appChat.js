var tablinks = document.querySelectorAll("header .nav__link")

document.querySelectorAll(".app-container")[1].style.display = "none"
document.querySelectorAll(".app-container")[2].style.display = "none"

tablinks.forEach(element => {
    //change nav bar color
    element.addEventListener('click', () => {
        tablinks.forEach(clear => {
            clear.className = clear.className.replace("nav__link--active", "")
        })
        element.className += " nav__link--active"

        //show the new page
        var index = [].indexOf.call(tablinks, element)
        document.querySelectorAll(".app-container").forEach(clear => {
            clear.style.display = "none"
        })
        document.getElementById(index).style.display = "grid"
    })
})

const characList = document.querySelectorAll(".charac__list")
const feedsList = document.querySelectorAll(".feeds__list")
const channelList = document.querySelectorAll(".channel__item")

function changeClassChannel(index) {
    channelList.forEach(clear => {
        clear.className = clear.className.replace("channel__item--active", "")
    })
    channelList[index].className += " channel__item--active"
}

characList.forEach(element => {
    element.addEventListener('click', () => {
        characList.forEach(clear => {
            clear.getElementsByClassName("nav__link")[0].className = clear.getElementsByClassName("nav__link")[0].className.replace("nav__link--active", "")
        })
        feedsList.forEach(clear => {
            clear.getElementsByClassName("nav__link")[0].className = clear.getElementsByClassName("nav__link")[0].className.replace("nav__link--active", "")
        })

        element.getElementsByClassName("nav__link")[0].className += " nav__link--active"
        var index = [].indexOf.call(characList, element)
        changeClassChannel(index+feedsList.length)

        const seed = document.getElementsByClassName("segment-topbar__overline")[0]
        const name = document.querySelector(".channel-link__element-topbar")
        console.log(element.querySelector(".conversation-link__element").textContent)
        seed.textContent = "NetWire_Seed: " + element.querySelector(".charac__seed").value
        name.textContent = element.querySelector(".conversation-link__element").textContent
    })
})
feedsList.forEach(element => {
    element.addEventListener('click', () => {
        characList.forEach(clear => {
            clear.getElementsByClassName("nav__link")[0].className = clear.getElementsByClassName("nav__link")[0].className.replace("nav__link--active", "")
        })
        feedsList.forEach(clear => {
            clear.getElementsByClassName("nav__link")[0].className = clear.getElementsByClassName("nav__link")[0].className.replace("nav__link--active", "")
        })

        element.getElementsByClassName("nav__link")[0].className += " nav__link--active"
        var index = [].indexOf.call(feedsList, element)
        changeClassChannel(index)
    })
})


const send = document.getElementById("send")

send.addEventListener('click', () => {
    var message = document.getElementById("message").value
    document.getElementById("message").value = ""

    const messageDiv = document.createElement("div")
    messageDiv.className = "message send"

    const messageBodyDiv = document.createElement("div")
    messageBodyDiv.className = "message__body"

    const messageTextDiv = document.createElement("div")
    messageTextDiv.textContent = message

    const messageFooterDiv = document.createElement("div")
    messageFooterDiv.className = "message__footer"

    const messageAuthoringSpan = document.createElement("span")
    messageAuthoringSpan.className = "message__authoring"

    const messageFooter = sessionStorage.getItem("firstnameCharacter") + " " + sessionStorage.getItem("lastnameCharacter")
    messageAuthoringSpan.textContent = messageFooter
    messageFooterDiv.appendChild(messageAuthoringSpan)
    messageFooterDiv.textContent += " - 1:00 PM"

    messageBodyDiv.appendChild(messageTextDiv)
    messageDiv.appendChild(messageBodyDiv)
    messageDiv.appendChild(messageFooterDiv)

    channelList.forEach(channel => {
        if (channel.className.includes("channel__item--active")) {
            channel.getElementsByClassName("channel__body")[0].appendChild(messageDiv)
        }
    })
})

function getName() {
    var name = ""
    characList.forEach(element => {
        if (element.getElementsByClassName("nav__link")[0].className.includes("nav__link--active")) {
            name = element.querySelector(".conversation-link__element").textContent 
        }
    })
    feedsList.forEach(element => {
        if (element.getElementsByClassName("nav__link")[0].className.includes("nav__link--active")) {
            name = element.querySelector(".channel-link__element").textContent
        }
    })
    return name
}