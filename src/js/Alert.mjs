function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Bad Response");
    }
}  
export default class Alert {
    constructor(main) {
        this.path = `../json/alerts.json`;
        this.main = main;
    }
    async init() {
        // retrieve alerts
        const alerts = await this.getData()
        // check if there are alerts stored in json file
        if (alerts.length > 0) {
            // create section and add alert-list class
            let section = document.createElement("section");
            section.classList.add("alert-list");
            // loop throught retrieved alerts and append them to the alert=list section
            alerts.forEach(el => {
                let p = document.createElement("p");
                p.style.backgroundColor = el.background;
                p.style.color = el.color;
                p.innerHTML = el.message;

                section.appendChild(p);
            });
            // prepend complete alerts section to main
            this.main.prepend(section);
        }
    }
    async getData() {
        return fetch(this.path)
        .then(convertToJson)
        .then((data) => data);
    }

}