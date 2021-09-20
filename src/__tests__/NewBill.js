import { getByTestId } from '@testing-library/dom' // ajout RP
import "@testing-library/jest-dom/extend-expect"; // ajout RP pour faire fonctionner toHaveTextContent cf https://github.com/testing-library/react-testing-library/issues/379

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it shoud show inputs", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    expect(
      getByTestId(document.body, 'expense-type')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'expense-name')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'datepicker')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'amount')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'vat')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'pct')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'commentary')
    ).not.toBeUndefined()
    expect(
      getByTestId(document.body, 'file')
    ).not.toBeUndefined()
  }) //test

  test("Then it should show Envoyer button", () => {
    const html = NewBillUI()
    document.body.innerHTML = html

  expect(
    getByTestId(document.body, 'form-new-bill')
  ).toHaveTextContent('Envoyer')

}) //test
  })//describe
})