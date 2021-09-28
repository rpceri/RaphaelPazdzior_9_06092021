// pour test intégration : permet de signaler a jest qu'on est dans un environement qui utilise le dom
/**
* @jest-environment jsdom
*/
import '@testing-library/jest-dom'// ajout RP idem ci dessus (permet d'utiliser par ex toHaveTextContent (matchers propre aux dom de jest))

import { fireEvent, getByLabelText, getByTestId, screen } from "@testing-library/dom"

import userEvent from '@testing-library/user-event' // permet de completer les form et faire des clic de souris

import "@testing-library/jest-dom/extend-expect"; // ajout RP pour faire fonctionner toHaveTextContent cf https://github.com/testing-library/react-testing-library/issues/379

import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"

/////// containers test
const data = []
const loading = false
const error = null


describe('Given I am connected and I am on dashboard', () => {
  describe('When I navigate to NewBill page', () => {
    test(('Then, it should render NewBill page...'), () => {
      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
      })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
        document.querySelector(`tbody[data-testid="tbody"]`).innerHTML = contenuHtml
      }
      document.body.innerHTML = html
      new NewBill({ document, onNavigate, firestore:undefined, localStorage })

      expect(document.body).toHaveTextContent('Envoyer une note de frais')  //idem testé ok : expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

  })//describe
})//describe


describe('Given I am connected and I am on new bill page', () => {

  describe('When I click on submit form', () => {

    test(('Then, it should return on dashboard'), () => {

      Object.defineProperty(window, 'localStorage', { value: localStorage })
      //user est défini ainsi dans localstorage : const user  = {"type":"Employee","email":"thomas@facadia.com","password":"azerty","status":"connected"}"
      const user = JSON.stringify({
        email: 'thomas@facadia.com'
      })
      window.localStorage.setItem('user', user)
  
      const pathname = '#employee/bill/new'   // ou ROUTES_PATH['NewBill']

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = ROUTES({ pathname })
      const firestore = null

      new NewBill({ document, onNavigate, firestore, localStorage })


     // const onSubmit = jest.fn();
      //render(<RecipeSearch onSubmit={onSubmit} />);
      //userEvent.selectOptions(screen.getByRole('combobox'), 'Sour');
     // userEvent.type( getByLabelText(document.body, 'Type de dépense'))  // type permet de simuler une action du clavier 
      userEvent.click(screen.getByText('Envoyer')); // getByRole(document.body, button) a condition que la balise button ait l'attribut rol="button"
      //userEvent.click(getByTestId(document.body, 'form-new-bill"')) // =  document.querySelector(`form[data-testid="form-new-bill"]`) en dom
      expect(document.body).toHaveTextContent('Mes notes de frais')
    })
  })//describe
})




describe('Given I am connected and I am on new bill page', () => {

  describe('When I click on file button', () => {

    test(('Then, handleChangeFile method should be called'), () => {

      Object.defineProperty(window, 'localStorage', { value: localStorage })
      //user est défini ainsi dans localstorage : const user  = {"type":"Employee","email":"thomas@facadia.com","password":"azerty","status":"connected"}"
      const user = JSON.stringify({
        email: 'thomas@facadia.com'
      })
      window.localStorage.setItem('user', user)
  
      const pathname = '#employee/bill/new'   // ou ROUTES_PATH['NewBill']

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = ROUTES({ pathname })
      const firestore = null

      const newbillnew = new NewBill({ document, onNavigate, firestore, localStorage })

     // const onSubmit = jest.fn();
      //render(<RecipeSearch onSubmit={onSubmit} />);
      //userEvent.selectOptions(screen.getByRole('combobox'), 'Sour');
     // userEvent.type( getByLabelText(document.body, 'Type de dépense'))  // type permet de simuler une action du clavier 
      /*const fileBefore = '1' //this.document.querySelector(`input[data-testid="file"]`).files[0]
      userEvent.click(screen.getByTestId('file')); // getByRole(document.body, button) a condition que la balise buttone ait l'attributt rol="button"
      const fileAfter = '2' //this.document.querySelector(`input[data-testid="file"]`).files[0]
      expect(fileBefore).toBeLessThanOrEqual(fileAfter)*/
      const handleChangeFile = jest.fn((e) => newbillnew.handleChangeFile(e))   
      const btfile = screen.getByTestId('file')
      btfile.addEventListener('click', handleChangeFile)
      userEvent.click(btfile)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })//describe
})


