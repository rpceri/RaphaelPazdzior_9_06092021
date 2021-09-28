// pour test intégration : permet de signaler a jest qu'on est dans un environement qui utilise le dom
/**
* @jest-environment jsdom
*/
$.fn.modal = jest.fn(); // pour pouvoir utiliser bootstrap, utile pour $('#modaleFile').modal('show') se trouvant dans le js a tester

import '@testing-library/jest-dom'// ajout RP idem ci dessus (permet d'utiliser par ex toHaveTextContent (matchers propre aux dom de jest))

import {getByTestId} from "@testing-library/dom"
import userEvent from '@testing-library/user-event' // permet de completer les form et faire des clic de souris

import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"




describe('container/Bills', () => {

    describe('Given I am connected as Employee', () => {

    describe('When I click on the icon eye of dashboard page', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        })) // Employee ou Admin
      //var contenuHtml = '<button type="button" data-testid="btn-new-bill" class="btn btn-primary">Nouvelle note de frais</button>'+      
      var contenuHtml ='<div id="eye" data-testid="icon-eye" data-bill-url="https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2Fles%202%20figurines%20peppa%20pig.png?alt=media&amp;token=3d5aee4b-791a-4971-9c6f-fa3ddcc4f6a6"><svg xmlns="http://www.w3.org/2000/svg" width="0.244444in" height="0.166667in" viewBox="0 0 22 15"><path id="Imported Path" fill="#0D5AE5" stroke="none" stroke-width="0" ></path></svg></div>'
     
      var pathname = '#employee/bills'
      document.body.innerHTML = ROUTES({ pathname })  
      document.querySelector(`tbody[data-testid="tbody"]`).innerHTML = contenuHtml
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
          document.querySelector(`tbody[data-testid="tbody"]`).innerHTML = contenuHtml
        }
        const firestore = null
        new Bills({ document, onNavigate, firestore, localStorage: window.localStorage  })
  
        userEvent.click(getByTestId(document.body, 'icon-eye'))

        expect(
            getByTestId(document.body, 'modaleFileDt')
          ).not.toBeUndefined()
      })
    })

    describe('When I click on "Nouvelle note de frais" button', () => {
      test('A new page "Envoyer une note de frais" should be loaded', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        })) // Employee ou Admin

      var pathname = '#employee/bills'
      document.body.innerHTML = ROUTES({ pathname })   
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null
        new Bills({ document, onNavigate, firestore, localStorage: window.localStorage  })
  
        userEvent.click(getByTestId(document.body, 'btn-new-bill'))

        expect(document.body).toHaveTextContent('Envoyer une note de frais')
      })
    })

  })


  describe('Given I am connected as Employee', () => {

    describe('When I am on bills page', () => {
      test('getBills should\'nt be called simply', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorage })
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee' })) // Employee ou Admin
        window.localStorage.setItem('user', JSON.stringify({email: 'thomas@facadia.com' }))

      var pathname = '#employee/bills'
      document.body.innerHTML = ROUTES({ pathname })  
     // document.querySelector(`tbody[data-testid="tbody"]`).innerHTML = contenuHtml
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
          //document.querySelector(`tbody[data-testid="tbody"]`).innerHTML = contenuHtml
        }
        const firestore = null
        const bills = new Bills({ document, onNavigate, firestore, localStorage: window.localStorage  })
  
        const getSpy = jest.spyOn(bills, "getBills")
        //const billsss = bills.getBills()
        expect(getSpy).toHaveBeenCalledTimes(0)
      })
    })

  })



})