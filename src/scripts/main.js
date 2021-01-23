class CreateUser {
    users = [];
    modalDom = new bootstrap.Modal(document.getElementById("exampleModal"));
    confirmModalDom = new bootstrap.Modal(
      document.getElementById("confirmModal")
    );
    formConfirmDom = document.querySelector(".js_form_confirm");
    btnsRegister = document.querySelectorAll(".js_register_event_register");
  
    constructor() {
      // se ejecuta el constructor
      this.init();
    }
  
    init() {
      this.getUsers();
      this.registerEventFormRegister();
      this.registerButtonsRegister();
      this.getDom().refModalRegisterEdit.addEventListener(
        "hidden.bs.modal",
        () => {
          this.getDom().formRegisterEdit.reset();
        }
      );
    }
  
    getUsers() {
      fetch('http://localhost:3000/pets')
      .then((response) => response.json())
      .then(pets => {
        this.makeCardUser(pets)
      })
    }

    registerEventFormRegister() {
      const form = this.getDom().formRegisterEdit; // atrapo formulario
      form.onsubmit = (event) => {
        // registro evento en el formulario
        event.preventDefault();
        this.getValuesUser();
        this.modalDom.hide();
        form.reset();
      };
    }
  
    registerButtonsRegister() {
      this.btnsRegister.forEach((btn) => {
        btn.onclick = () => {
          this.registerEventFormRegister();
        };
      });
    }
  
    editDomCard(values, id) {
      const card = document.getElementById(id);
      const { name, lastname, raza, phone, country, photo } = values;
      
      card.parentElement.innerHTML = `
          <div class="replace">
              <figure><img src=${photo} width="50" height="50"/></figure>
              <div class="card-body">
                  <ul class="list-group">
                      <li class="list-group-item"><label>Nombre completo:</label>${name} ${lastname}</li>
                      <li class="list-group-item"><label>Raza:</label>${raza}</li>
                      <li class="list-group-item"><label>Telefono:</label>${phone}</li>
                      <li class="list-group-item"><label>Pais:</label>${country}</li>
                  </ul>
              </div>
          </div>
      `;
    }
  
    registerEventFormEdit(element) {
      const form = this.getDom().formRegisterEdit;
  
      form.onsubmit = (event) => {
        event.preventDefault();
        this.editUserpet(this.getValuesUserEdit(), element.id);
        this.editDomCard(this.getValuesUserEdit(), element.id);
        this.modalDom.hide();
      };
    }
  
    getDom() {
      const form = {
        name: document.querySelector(".js_name"),
        lastname: document.querySelector(".js_lastname"),
        raza: document.querySelector(".js_raza"),
        phone: document.querySelector(".js_phone"),
        country: document.querySelector(".js_country"),
        photo: document.querySelector(".js_photo"),
      };
  
      const formRegisterEdit = document.querySelector(".js_form");
      const refModalRegisterEdit = document.getElementById("exampleModal");
  
      return {
        form,
        formRegisterEdit,
        refModalRegisterEdit,
      };
    }
  
    getValuesUser() {
      const valuesUser = {
        name: this.getDom().form.name.value,
        lastname: this.getDom().form.lastname.value,
        raza: this.getDom().form.raza.value,
        phone: this.getDom().form.phone.value,
        country: this.getDom().form.country.value,
        photo: this.getDom().form.photo.value,
      };

      this.saveUser(valuesUser);
      return valuesUser;
    }

    getValuesUserEdit() {
      const valuesUser = {
        name: this.getDom().form.name.value,
        lastname: this.getDom().form.lastname.value,
        raza: this.getDom().form.raza.value,
        phone: this.getDom().form.phone.value,
        country: this.getDom().form.country.value,
        photo: this.getDom().form.photo.value,
      };

      return valuesUser;
    }

    makeCardUser(pets) {

      pets.forEach(element => {
        const { name, lastname, raza, phone, country, photo,id } = element;
        const card = document.createElement("article");
        //const idUnique = this.unitId();
        card.classList.add("card");
        //card.id = idUnique;
        card.innerHTML = `
            <button type="button" class="js_edit btn-primary icon icon-left"><i class="far fa-edit"></i></button>
            <button type="button" class="js_delete btn-danger icon icon-right"><i class="fas fa-trash-alt"></i></button>
            <div id="${id}" class="replace">
                <figure><img src=${photo}/></figure>
                <div class="card-body">
                    <ul class="list-group">
                        <li class="list-group-item"><label>Nombre completo:</label>${name} ${lastname}</li>
                        <li class="list-group-item"><label>Raza:</label>${raza}</li>
                        <li class="list-group-item"><label>Telefono:</label>${phone}</li>
                        <li class="list-group-item"><label>Pais:</label>${country}</li>
                    </ul>
                </div>
            </div>
        `;
    
        card.querySelector(".js_edit").onclick = () => {
          this.editUser(element);
        };
    
        card.querySelector(".js_delete").onclick = () => {
          this.confirmModalDom.show();
          this.formConfirmDom.onsubmit = (event) => {
            event.preventDefault();
            this.deleteUser(element.id);
            this.confirmModalDom.hide();
            this.toggleAdd(pets);
          };
        };
        
        this.toggleAdd(pets);

        this.addCardinDom(card); // obtener valores del formulario
        return card;

      });
    }

    saveUser(values){
      fetch('http://localhost:3000/pets',
                        {
                            method: 'POST',
                            //enviamos el objeto form
                            body: JSON.stringify(values),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((response) => response.json());
    }

    editUserpet(values, id){
      console.log(values.name);
      fetch('http://localhost:3000/pets/'+ id, {
        method: 'PUT',
        body: JSON.stringify({
            name: values.name,
        lastname: values.lastname,
            raza: values.raza,
           phone: values.phone,
         country: values.country,
          photo: values.photo,
              id: id,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));

    }
    editUser(element) {
      this.registerEventFormEdit(element);
      const valueUser = element;
  
      for (const elementForm in this.getDom().form) {
        this.getDom().form[elementForm].value = valueUser[elementForm];
      }
  
      this.modalDom.show();
    }
  
    deleteUser(id) {
      //Conexion a BD json
      fetch('http://localhost:3000/pets/' + id,
          {
              method: 'DELETE'
          })
          .then((response) => response.json())
    }
  
    addCardinDom(card) {
      const app = document.getElementById("app");
      app.appendChild(card);
    }
  
    toggleAdd(pets) {
      const btnAdd = document.querySelector(".js_add");
      const btnAddHeader = document.querySelector(".js_add_header");
  
      if (pets.length > 0) {
        btnAdd.classList.add("d-none");
        btnAddHeader.classList.remove("d-none");
      } else {
        btnAdd.classList.remove("d-none");
        btnAddHeader.classList.add("d-none");
      }
    }
  }
  
  new CreateUser();

  /*

  getUser() -- para el init()
  saveUser() -- Grabar el usuario
        makeCard() -> push()
  deleteUser() -- borrar
  putUser() -- modificar
        editUser() -> invocar al PUT

  TODO CON FETCH
  */