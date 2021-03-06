
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }
  
  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    //const fileName = file.name // au lieu de ci dessus car impossible de tester, mais reviens ua meme au final

     // ajout RP pour empêcher la saisie d'un document qui a une extension différente de jpg, jpeg ou png, aurions pu utiliser : <input accept="audio/*|video/*|image/*|MIME_type" /> :
     // suppr des éventuelles erreurs précédentes si l'utilisateur a soumis un mauvais fichier une première fois :
    if(document.getElementById('alertFile')) this.document.querySelector(`span[id="alertFile"]`).innerHTML = "";
    this.document.querySelector(`input[data-testid="file"]`).setCustomValidity("");

    const extension =  fileName.split('.').pop()
    if ( ! /\png|\jpg|\jpeg$/.test(extension)) { // regexp pour tester si l'extention désigne bien une image 
      var MessageErreur =  `${fileName} : Format ${extension} non permis`

      //creation d'une span en dessous de l'imput pour message d'erreur
      var el = document.createElement("span");
      el.setAttribute("id", "alertFile");
      el.innerHTML = MessageErreur;
      var div = this.document.querySelector(`input[data-testid="file"]`)
      div.parentNode.insertBefore(el, div.nextSibling);
      this.document.querySelector(`input[data-testid="file"]`).setCustomValidity(MessageErreur); // utile pour blocker la soumission du formulaire
      return
    }

    this.firestore
      .storage
      .ref(`justificatifs/${fileName}`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.fileUrl = url
        this.fileName = fileName
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    //console.log("type : " + bill.type)
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
/* istanbul ignore next */
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}