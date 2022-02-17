const qrcode = require('qrcode')
const path = require('path')
const vCard = require('vcards-js')
const card = vCard()
const fs = require('fs')
const cloud = require('./storage')


// generates image, params = input fields & component identity
 async function generate (params) { 
    const {type, input} = params
   
   const message = converter(type, input)

   
   

  const urlResponse =  await qrcode.toDataURL(message)

  const imageResponse = await cloud.uploader.upload(urlResponse)
  
  return {url: imageResponse.secure_url, id: imageResponse.public_id}
}
   
   




const converter = (type, input) => {
    try{

        switch(type){
            case 'vcard':
                return vCardGenerator(input)
            case 'message':
                return input.message
            case 'mail':
                return emailQR(input)
            case 'sms':
                return mobileQR(input)
            default: 
            // none
        }

    } catch(err){
        if(err) throw err
    }
    
}



// vcard
const vCardGenerator = (input) => {
    card.firstName = input.f_name
    card.lastName = input.s_name
    card.email = input.email
    card.cellPhone = input.number
    card.organization = input.company
    card.homeAddress.street = input.street
    card.homeAddress.city = input.residence
    card.homeAddress.postalCode = input.zip
    card.url = `https://${input.website}`
    
    return card.getFormattedString()
}


// email :

const emailQR = (params) => {
    const {email, subject} = params
    return `mailto:${email}?subject=${subject}`
}

//phone 
const mobileQR = (params) => {
    const {number, body} = params
    return `sms:${number}?body=${body}`
}

function makeId (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

module.exports = async (params) => {
    return await generate(params)
}