const data = {
    email: 'nataliia.ivaniv@gmail.com',
    password: 'ivaniv30',
};
const config = {headers: {
        Authorization: 'Bearer 63e09095c5e8'
    }};

const url = 'http://cards.danit.com.ua/cards';

class Visit {
    constructor(id, type, fio, Appointment) {
        this.id = id;
        this.type = type;
        this.fio = fio;
        this.Appointment  = Appointment;
    }
    static basicFields = [
        {id: 'fio', label: 'Family Name', name: 'fio', value: ''},
        {id: 'visit', label: 'Date of visit', name: 'day', value: ''},
    ];
    static load(customFields) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        type: '0',
                        value: '0',
                        fields: [
                            ...Visit.basicFields,
                            customFields || []
                        ]
                    },
                ])
            }, 500)
        });
    }
    static render(list) {
        const wrapper = document.getElementById('fieldsWrapper');
        wrapper.innerHTML = '';
        if (Array.isArray(list)) {
            list.forEach(field => {
                wrapper.innerHTML += `
            <div class="form-group">
        <label for="recipient-name" type="text" class="col-form-label">${field.label}:</label>
    <input class="form-control"  name="${field.name}" id="${field.id}" autocomplete="off" required="true">
        </div>`;
            });
        }
    }
    static create(listItem) {
        const wrapperCard = document.querySelector('.wrapperCard');
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('draggable', 'true');
        wrapperCard.append(card);
        const cross = document.createElement('div');
        cross.setAttribute('class', 'cross');
        cross.innerText = 'X';
        card.append(cross);
        cross.onclick = function () {
            card.style.display = 'none';
            axios.delete(`http://cards.danit.com.ua/cards/${listItem.id}`, config)};
        const wraperDrag = document.createElement('div');
        wraperDrag.setAttribute('draggable', 'true');
        wraperDrag.setAttribute('class', 'wraperDrag');
        card.append(wraperDrag);
        const fio = document.createElement('div');
        fio.setAttribute('class', 'infoInCards');
        fio.setAttribute('id', 'fio');
        fio.innerHTML = `${listItem.fio}`;
        wraperDrag.append(fio);
        const doctor = document.createElement('div');
        doctor.setAttribute('class', 'infoInCards');
        doctor.setAttribute('id', 'doctor');
        doctor.innerHTML = `${listItem.type}`;
        wraperDrag.append(doctor);
        const addInformation = document.createElement('div');
        addInformation.setAttribute('class', 'addInformation');
        addInformation.setAttribute('id', 'addInformation');
        addInformation.textContent = 'Show more information';
        card.append(addInformation);
        addInformation.addEventListener('click', function () {
            addInformation.style.display = 'none';
            const otherInf = document.createElement('div');
            otherInf.setAttribute('class', 'otherInf');
            otherInf.setAttribute('id', 'otherInf');
            card.append(otherInf);
            const ul = document.createElement('ul');
            otherInf.append(ul);
            Object.entries(listItem).forEach(([key, value]) => {
                if (key !== 'id' && key !== 'type' && key !== 'fio') {
                    const list = document.createElement('li');
                    list.setAttribute('class', 'liClass');
                    ul.append(list);
                    list.innerHTML = `${key}: ${value}`;
                }
            });
            const hiddenInfo = document.createElement('div');
            hiddenInfo.setAttribute('class', 'hdInf active');
            hiddenInfo.textContent = 'Hide information';
            card.append(hiddenInfo);
            hiddenInfo.addEventListener('click', function () {
                addInformation.style.display = 'block';
                otherInf.classList.add('active');
                hiddenInfo.textContent = '';
            })
        });
        const wrapper = document.querySelector('.wrapperCard');
        const title = document.querySelector('.title');
        if(wrapper.children.length > 0){
            title.classList.add('active');
        }
        const modal = document.querySelector('.modal');
        modal.classList.remove('active');

        const form = document.querySelector('.formWithValidation');
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(input => {
            input.value = '' });

        wraperDrag.onmousedown = function(e) {
            const coords = getCoords(card);
            const shiftX = e.pageX - coords.left;
            const shiftY = e.pageY - coords.top;
            card.style.position = 'absolute';
            document.body.appendChild(card);
            moveAt(e);
            card.style.zIndex = 3;

            function moveAt(e) {
                card.style.left = e.pageX - shiftX + 'px';
                card.style.top = e.pageY - shiftY + 'px';
            }
            document.onmousemove = function(e) {
                moveAt(e);
            };
            card.onmouseup = function() {
                document.onmousemove = null;
                card.onmouseup = null;
            };
        };
        card.ondragstart = function() {
            return false;
        };
    }
}

class Dentist extends Visit {
    constructor(id, type, fio, visit, Visit, Commentary) {
        super(id, type, fio, visit);
        this.Visit = Visit;
        this.Commentary = Commentary;
    }
    static customFields = [
        {id: 'last visit', label: 'Date of last visit', name: 'last day', value:''},
        {id: 'comment', label: 'Please input comments', name: 'comment', value:''}
    ];
    static load(){
        super.load(Dentist.customFields);
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve([
                    {
                        type: 'Dentist',
                        value: 'Dentist',
                        fields: [
                            ...Visit.basicFields,
                            ...Dentist.customFields
                        ]
                    },
                ])
            },500)
        });
    }
}
class Therapist extends Visit {
    constructor(id, type, fio, visit, Age, Commentary) {
        super(id, type, fio, visit);
        this.Age = Age;
        this.Commentary = Commentary;
    }
    static customFields = [
        {id: 'age', label: 'Age', name: 'age', value:''},
        {id: 'comment', label: 'Please input comments', name: 'comment', value:''}
    ];
    static load(){
        super.load(Therapist.customFields);
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve([
                    {
                        type: 'Therapist',
                        value: 'Therapist',
                        fields: [
                            ...Visit.basicFields,
                            ...Therapist.customFields
                        ]
                    },
                ])
            },500)
        });
    }
}
class Cardiologist extends Visit {
    constructor(id, type, fio, visit, Pressure, Index, Diseases, Age, Commentary) {
        super(id, type, fio, visit);
        this.Pressure = Pressure;
        this.Index = Index;
        this.Diseases = Diseases;
        this.Age = Age;
        this.Commentary = Commentary;
    }
    static customFields = [
        {id: 'pressure', label: 'Normal pressure', name: 'pressure', value:''},
        {id: 'index', label: 'Body mass index', name: 'index', value:''},
        {id: 'diseases', label: 'Earlier diseases of the CS', name: 'diseases', value:''},
        {id: 'age', label: 'Age', name: 'age',value:''},
        {id: 'comment', label: 'Please input comments', name: 'comment', value:''}
    ];
    static load(){
        super.load(Cardiologist.customFields);
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve([
                    {
                        type: 'Cardiologist',
                        value: 'Cardiologist',
                        fields: [
                            ...Visit.basicFields,
                            ...Cardiologist.customFields
                        ]
                    },
                ])
            },500)
        });
    }
}
const inputsValue = function(){
    const id = '';
    const doctor = document.querySelector('#doctorType').value;
    const formValue = document.querySelectorAll('.form-control');
    const arrayValue = Array.from(formValue);
    const postValue = [];
    postValue.push(id);
    postValue.push(doctor);
    arrayValue.forEach(value =>
        postValue.push(value.value));
    return postValue;
};
async function onSubmitClick(e){
    const docType = document.getElementById('doctorType').value;
    const inputs = inputsValue();
    if(docType === 'Dentist') {
        const newDentist = new Dentist(...inputs);
        Visit.create(newDentist);
        await axios.post(url, newDentist, config
        ).then(response => newDentist.id = response.data.id);
    }
    if(docType === 'Therapist') {
        const newTherapist = new Therapist(...inputs);
        Visit.create(newTherapist);
        await axios.post(url, newTherapist, config
        ).then(response => newTherapist.id = response.data.id);
    }
    if(docType === 'Cardiologist') {
        const newCardiologist = new Cardiologist(...inputs);
        Visit.create(newCardiologist);
        await axios.post(url, newCardiologist, config
        ).then(response => newCardiologist.id = response.data.id);
    }
    if(docType === '0') {
        alert('Please select a doctor!')
    }
}
async function onDoctorSelect(e) {
    const select = e.target;
    $(select).attr('disabled', 'disabled');
    const wrapper = document.getElementById('fieldsWrapper');
    wrapper.innerHTML = `<span class="spinner-grow spinner-grow-sm color" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`;

    const doctors = await Visit.load();
    const doctor = doctors.find(doctor => doctor.value === select.value);
    const dentists = await Dentist.load();
    const dentist = dentists.find(dentist => dentist.value === select.value);
    const therapists = await Therapist.load();
    const therapist = therapists.find(therapist => therapist.value === select.value);
    const cardiologists = await Cardiologist.load();
    const cardiologist = cardiologists.find(cardiologist => cardiologist.value === select.value);

    if(dentist) {
        Visit.render(dentist.fields);
    }
    if(cardiologist) {
        Visit.render(cardiologist.fields);
    }
    if(therapist) {
        Visit.render(therapist.fields);
    }
    if(doctor) {
        const wrap =  document.getElementById('fieldsWrapper');
        const div = document.createElement('div');
        div.style.color = 'red';
        div.innerHTML = 'Please select a doctor from above options!';
        wrap.append(div);
    }
    $(select).removeAttr('disabled');
}
function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
function openModal() {
    const button = document.querySelector('.button');
    button.addEventListener('click', function () {
        const modal = document.querySelector('.modal');
        modal.classList.add('active');
    });
}
function closeModal() {
    const cross = document.querySelector('.close');
    cross.addEventListener('click', function (event) {
        event.preventDefault();
        const modal = document.querySelector('.modal');
        modal.classList.remove('active');
    })
}

document.addEventListener('DOMContentLoaded', onLoad());
function onLoad() {
    const title = document.querySelector('.title');
    axios.get(url, config)
        .then(response => {
            if(response.data.length > 1) {
                title.classList.add('active');
                response.data.forEach(item => Visit.create(item))
            }
        });
}
