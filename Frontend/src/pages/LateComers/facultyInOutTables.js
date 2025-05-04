import React from 'react'
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button } from "reactstrap"
function FacultyInOutTables({ facultyInData, facultyOutData }) {
  const inData = {
    columns: [
      {
        label: "Staff ID",
        field: "facultyId",
      },
      {
        label: "Staff Name",
        field: "facultyName",
      },
      {
        label: "Gender",
        field: "facultyGender",
      },
      {
        label: "Time_In",
        field: "inTime",
        sort: "desc",
      }
    ],
    rows: facultyInData && facultyInData.sort((a, b) => b.inTime.localeCompare(a.inTime)).map(student => ({
      ...student
    })),
  }

  const outData = {
    columns: [
      {label: "Staff ID",field: "facultyId",},
      {label: "Staff Name",field: "facultyName",},
      {label: "Gender",field: "facultyGender",},
      {label: "Time_Out",field: "outTime", }
    ],
    rows: facultyOutData && facultyOutData.sort((a, b) => b.outTime.localeCompare(a.outTime)).map(student => ({
      ...student
    })),
  }
  return (
    <>
      <Row>
        <Col className="col-6">
          <h2>Staff In Data</h2 >
          <Card>
            <CardBody>
              <MDBDataTable
                data={inData}
                responsive
                bordered
                striped
                entries={5}
                pagesAmount={5} 
                noBottomColumns
                paginationLabel={["Prev", "Next"]}
                hover
              />
            </CardBody>
          </Card>
        </Col>
        <Col className="col-6">
          <h2>Staff Out Data</h2>
          <Card>
            <CardBody>
              <MDBDataTable
                data={outData}
                responsive
                bordered
                striped
                noBottomColumns
                entries={5}
                pagesAmount={5} 
                paginationLabel={["Prev", "Next"]}
                hover
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default FacultyInOutTables