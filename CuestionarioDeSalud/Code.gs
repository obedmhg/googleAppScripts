function setUpTrigger() {
    ScriptApp.newTrigger('sendEmail').forForm('<the FormId to associate the trigger>').onFormSubmit().create();
}


function sendEmail(e) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let itemResponses = e.response.getItemResponses();
    let message = ''
    let template = HtmlService.createTemplateFromFile('template');
    let htmlResponses = "<h1>Cuestionario de estado de Salud CEIES " + itemResponses[0].getResponse() + "</h1>";
    htmlResponses += "<img src='https://sometools.netlify.app/Logo_ceies.jpg' /> <br>";
    htmlResponses += "<b>Fecha: </b>" + today + "<br>";
    htmlResponses += "<b>" + itemResponses[0].getItem().getTitle() + ":</b> " + itemResponses[0].getResponse() + "<br>";
    htmlResponses += "<b>" + itemResponses[1].getItem().getTitle() + ":</b> " + itemResponses[1].getResponse() + "<br>";
    htmlResponses += "<b>" + itemResponses[2].getItem().getTitle() + ":</b> " + itemResponses[2].getResponse() + "<br>";

    if (itemResponses[2].getResponse() == "Ninguno de los Anteriores") {
        htmlResponses += "<img src='https://sometools.netlify.app/ok.png' height='250px' width='250px'/>";
    } else {
        htmlResponses += "<img src='https://sometools.netlify.app/notOk.png' '/>";
        template = HtmlService.createTemplateFromFile('templateNotOk');
    }
    template.date = "Fecha: " + today;
    template.name = "Nombre: " + itemResponses[0].getResponse();
    template.grade = "Grupo: " + itemResponses[1].getResponse();
    template.synthoms = "Síntomas: " + itemResponses[2].getResponse();
    message = template.evaluate().getContent();
    let options = { htmlBody: message };
    GmailApp.sendEmail(e.response.getRespondentEmail(), "Cuestionario de estado de Salud CEIES - " + itemResponses[0].getResponse() + " del Dia " + today, htmlResponses, options);
}