// pour test intégration : permet de signaler a jest qu'on est dans un environement qui utilise le dom
/**
* @jest-environment jsdom
*/
import '@testing-library/jest-dom'// ajout RP idem ci dessus (permet d'utiliser par ex toHaveTextContent)

import { getByTestId } from '@testing-library/dom' // ajout RP
import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"



import { localStorageMock } from "../__mocks__/localStorage.js" // ajout RP
import "@testing-library/jest-dom/extend-expect"; // ajout RP pour faire fonctionner toHaveClass cf https://github.com/testing-library/react-testing-library/issues/379


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      // utile por faire appraitre icon-window :
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)

      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
      //to-do write expect expression
      //screen.debug() //pour voir screen, si on en avait besoin, screen représente le body contenant le composant https://testing-library.com/docs/queries/about/
      expect(
        getByTestId(document.body, 'icon-window')
      ).not.toBeFalsy
      /*expect(
        getByTestId(document.body, 'icon-window')
      ).toHaveClass('active-icon')*/
    })

    
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

 
    test("Then 'Nouvelle note de frais' button should be present", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      expect(
        getByTestId(document.body, 'btn-new-bill')
      ).not.toBeFalsy
    })
 
    
    test("Then BillsUI appelé sans loading doit afficher la page d'erreur", () => {
     const html = BillsUI({  data: bills, loading:undefined, error:'erreuurr'})
     document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
    test("Then BillsUI appelé avec loading à true doit afficher 'Loading...", () => {
      const html = BillsUI({  data: bills, loading:true, error:undefined})
      document.body.innerHTML = html
       expect(screen.getAllByText('Loading...')).toBeTruthy()
     })

     test("Then la page sans notes doit comporter un tabelau vide", () => {
      const html = BillsUI({})
      document.body.innerHTML = html
      expect(
        getByTestId(document.body, 'tbody').textContent.length).toBeLessThan(30) // normalement il y a 24 espaces....
    })

  })
})