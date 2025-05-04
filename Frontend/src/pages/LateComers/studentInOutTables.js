import React from 'react'
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button } from "reactstrap"
function StudentInOutTables({studentInData , studentOutData}) {
  const inData = {
    columns: [
      { label: "Student Roll", field: "studentRoll" },
      { label: "Student Name", field: "studentName" },
      { label: "Gender", field: "gender" },
      { label: "Time_In", field: "inTime"},
    ],
    rows: studentInData && studentInData.sort((a, b) => b.inTime.localeCompare(a.inTime)).map(student => ({
        ...student
      })),
  };

  const outData = {
    columns: [
      { label: "Student Roll", field: "studentRoll" },
      { label: "Student Name", field: "studentName" },
      { label: "Gender", field: "gender" },
      { label: "Time_Out", field: "outTime" },
    ],
    rows: studentOutData && studentOutData.sort((a, b) => b.outTime.localeCompare(a.outTime)).map(student => ({
        ...student
      })),
  };
  
  return (
    <>
    <Row>
        <Col className="col-6">
        <h2>Student In Data</h2>
          <Card>
            <CardBody>
              <MDBDataTable
                data={inData}
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
        <Col className="col-6">
        <h2>Student Out Data</h2>
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

export default StudentInOutTables