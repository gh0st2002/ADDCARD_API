import "./css/index.css"
import IMask from "imask"

// váriável Color e Logo

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path "
)

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// Alterar cor e bandeira
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#eb001b", "#f79e1b"],
    amex: ["#00BAFF", "#FFFFFF"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// Imask - Security Code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Imask - expiration-date

const expirationDate = document.querySelector ("#expiration-date")
const  expirationDatePattern ={
  mask: "MM{/}YY",
// Limitando o campo "expirationdate"
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },

    VL: {
      mask: IMask.MaskedEnum,
      enum: ['TV', 'HD', 'VR']
    }
  }
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Expressões regulares 
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 000000 00000",
      regex: /^3[47][0-9]{13}$/,
      cardtype: "amex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (append, dynamicMasked) {
    const number = (dynamicMasked.value + append).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () =>{
  alert('Cartão adicionado!')
})

document.querySelector("form").addEventListener('submit', (event)=>{
  event.preventDefault()
})


//Imask - NomeCartão (modificar visual)

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener('input',()=>{
  const ccHolder = document.querySelector(".cc-holder .value")

ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value

})

//Imask - NomeCartão (modificar visual)

securityCodeMasked.on('accept', () =>{
updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector('.cc-security .value')
  ccSecurity.innerText = code.length === 0 ? "123" : code
}
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", ()=>{
updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}




