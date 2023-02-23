class InputField{
    constructor(name, type="input"){
        this.dom_invalid_feedback = document.getElementById("invalid-feedback-" + name);
        this.dom_input = document.querySelector(type + "#" + name);
        this.dom_form = document.getElementById("select_stations_form");
    }
    
    make_valid(){
        this.dom_input.setCustomValidity('');
        this.dom_invalid_feedback.display = "none";
        this.dom_invalid_feedback.querySelector("ul").innerHTML = "";
    }

    make_invalid(msg){
        this.dom_form.classList.add("was-validated");
        this.dom_invalid_feedback.display = "block";
        this.dom_invalid_feedback.querySelector("ul").innerHTML += "<li>" + msg +"</li>";
        this.dom_input.setCustomValidity(this.dom_invalid_feedback.textContent);
    }

    is_valid(){
        return this.dom_input.checkValidity();
    }

    get_value(){
        return this.dom_input.value;
    }
}

export { InputField }