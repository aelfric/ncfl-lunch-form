import "./App.css";
import "./invoice.css";
import "./pico.min.css";

import formObj from "./form.json";
import dioceses from "./dioceses.json";
import * as React from "react";
import { useState } from "react";

const formProps: Record<
  string,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = {
  "Contact Phone": {
    type: "tel",
  },
  "Contact Email": {
    type: "email",
  },
};

const map: Record<string, string> = formObj.fields.reduce(
  (prev, next) => ({ ...prev, [`entry.${next.widgets[0].id}`]: next.label }),
  {},
);

let currencyFormat = new Intl.NumberFormat("us-EN", {
  style: "currency",
  currency: "USD",
});

function App() {
  const [invoice, setInvoice] = useState<any>(null);
  const topForms = formObj.fields.slice(0, 6);
  const lunchOpts = formObj.fields.slice(6);

  const chunks = [];
  for (let i = 0; i < lunchOpts.length; i += 6) {
    chunks.push(lunchOpts.slice(i, i + 6));
  }

  async function handleSubmit(data: FormData) {
    let studentCount = 0;
    let judgeCount = 0;
    let school;
    let requester;
    let email;

    const u = new URLSearchParams();
    for (const [k, v] of data) {
      u.set(k, String(v));
      if (map[k]) {
        if (map[k].includes("Student Lunch Option")) {
          studentCount += Number(v);
        } else if (map[k].includes("Judge Lunch Option")) {
          judgeCount += Number(v);
        } else if (map[k] === "School"){
          school = String(v);
        } else if (map[k] === "Coach Name"){
          requester = String(v);
        } else if (map[k] === "Contact Email"){
          email = String(v);
        }
      }
    }
    await fetch(
      `https://docs.google.com/forms/d/${formObj.action}/formResponse`,
      {
        method: "POST",
        mode: "no-cors",
        body: u.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    setInvoice({
      studentCount,
      judgeCount,
      school,
      requester,
      email
    });
  }

  if (invoice) {
    return (
      <div className="invoice-box">
        <table>
          <tbody>
            <tr className="top">
              <td colSpan={2}>
                <table>
                  <tbody>
                    <tr>
                      <td className="title">
                        <img
                          src="https://www.ncflnationals.org/uploads/7/3/2/8/7328308/published/ncfl.png"
                          alt="National Catholic Forensic League"
                          style={{ width: "100%", maxWidth: "125px" }}
                        />
                      </td>

                      <td>
                        Invoice #: 123
                        <br />
                        Created:{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(new Date())}
                        <br />
                        Due: May 17, 2025
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colSpan={2}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <address>
                          <b>National Catholic Forensic League</b>
                          <br />
                          c/o Mike Colletti
                          <br />
                          PO Box 31785
                          <br />
                          Chicago, IL 60631
                        </address>
                      </td>

                      <td>
                        <strong>School Name:</strong> {invoice.school}
                        <br />
                        <strong>Requester’s Name:</strong> {invoice.requester}
                        <br />
                        <strong>Email Address:</strong> {invoice.email}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr className="heading">
              <td>Payment Method</td>

              <td>&nbsp;</td>
            </tr>

            <tr className="details">
              <td colSpan={2}>
                Please make all checks payable to the National Catholic Forensic
                League. Payment must be mailed by May 17th or paid in-person in
                Chicago on May 24th at the Hilton Chicago Boulevard Foyer
                between 10 AM and 8 PM.
              </td>
            </tr>

            <tr className="heading">
              <td>Item</td>

              <td>Price</td>
            </tr>

            <tr className="item">
              <td>Student Lunches (x {invoice.studentCount})</td>

              <td>{currencyFormat.format(invoice.studentCount * 15)}</td>
            </tr>

            <tr className="item">
              <td>Judge Lunches (x {invoice.judgeCount})</td>

              <td>$0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="container">
      <h1>{formObj.title}</h1>
      <form action={handleSubmit}>
        <input type="hidden" name="fvv" value={1} />
        <input type="hidden" name="fbzx" value={formObj.fbzx} />
        <input type="hidden" name="pageHistory" value="0" />
        <p>
          <label>
            {topForms[0].label}
            <select
              name={`entry.${topForms[0].widgets[0].id}`}
              id={`${topForms[0].id}`}
            >
              <option>Please choose...</option>
              {dioceses.map((d) => (
                <option value={d} key={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </p>
        {topForms.slice(1).map((f) => (
          <p>
            <label>
              {f.label}{" "}
              <input
                id={`${f.id}`}
                name={`entry.${f.widgets[0].id}`}
                {...(formProps[f.label] ?? {})}
              />
            </label>
          </p>
        ))}
        <hr />
        <p>The following lunch options are available</p>
        <ul>
          <li>Ham with Lettuce and Tomato</li>
          <li>Turkey with Lettuce and Tomato</li>
          <li>
            Vegetarian with peppers, mushrooms, lettuce, tomato with pesto sauce
          </li>
        </ul>
        <p>
          All sandwiches are available on either a 6-inch hoagie roll or 6-inch
          gluten free hoagie roll.
        </p>
        <p>
          Lunch also includes a bottle of water, a small bag of pretzels and a
          small bag of cookies.
        </p>
        <p>
          Student Lunches are $15 each. Judge lunches are provided by the
          tournament at no charge. Payment for student lunches must be paid by
          check payable to:
        </p>
        <address>
          <b>National Catholic Forensic League</b>
          <br />
          c/o Mike Colletti
          <br />
          PO Box 31785
          <br />
          Chicago, IL 60631
        </address>
        <hr />
        <table>
          <thead>
            <tr>
              <td></td>
              <th>Ham</th>
              <th>Turkey</th>
              <th>Veggie</th>
              <th>Ham (GF)</th>
              <th>Turkey (GF)</th>
              <th>Veggie (GF)</th>
            </tr>
          </thead>
          <tbody>
            {chunks.flatMap((c, i) => (
              <>
                <tr key={i}>
                  <td>{c[0].label.replace(/Lunch Option \d /, "")}</td>
                  {c.map((f) => (
                    <td>
                      <input
                        key={f.id}
                        id={`${f.id}`}
                        name={`entry.${f.widgets[0].id}`}
                        aria-label={f.label}
                        type="number"
                        step={1}
                      />
                    </td>
                  ))}
                </tr>
                {i === 9 ? (
                  <tr>
                    <td colSpan={7}>&nbsp;</td>
                  </tr>
                ) : null}
              </>
            ))}
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default App;
