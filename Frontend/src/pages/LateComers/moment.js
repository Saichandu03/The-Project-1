import React, { useEffect, useState, useRef } from "react"
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Label, Button } from "reactstrap"
import StudentInOutTables from "./studentInOutTables"
import FacultyInOutTables from "./facultyInOutTables"
import ViewSuspendStudent from "./viewSuspendStudent"
import "./MomentStyles.css"
import axios from "axios"
import { connect } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import StudentDataTable from "./StudentDataTable"
import Data from "pages/Maps/LightData"
import { setBreadcrumbItems } from "store/actions"
import { forEach, result } from "lodash"

const GetInfo = props => {
  const [studentInData, setStudentInData] = useState([])
  const [studentOutData, setStudentOutData] = useState([])
  const [facultyInData, setFacultyInData] = useState([])
  const [facultyOutData, setFacultyOutData] = useState([])
  const [inSearchParameter, setInSearchParameter] = useState("")
  const [outSearchParameter, setOutSearchParameter] = useState("")
  const [isInUpdated, setIsInUpdated] = useState(false)
  const [isOutUpdated, setIsOutUpdated] = useState(false)
  // const [open , setOpen] = useState(false)
  const baseUrl = process.env.REACT_APP_API
  const inputRef = useRef(null)

  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Moment", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Moment", breadcrumbItems)
  })

  useEffect(() => {
    //to get the today student in data
    axios
      .get(baseUrl + "/today-Student-InData")
      .then(result => {
        console.log("Today Student In data is getting Successfully")
        setStudentInData(result.data)
        // console.log(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Student In data")
        console.log(err)
      })

    //to get the today student out data
    axios
      .get(baseUrl + "/today-Student-OutData")
      .then(result => {
        console.log("Today Student Out data is getting Successfully")
        // console.log(result.data)
        setStudentOutData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Student Out data")
        console.log(err)
      })

    // to get the today faculty In data
    axios
      .get(baseUrl + "/today-Faculty-InData")
      .then(result => {
        console.log("Today Faculty In data is getting Successfully")
        // console.log(result.data)
        setFacultyInData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Faculty In data")
        console.log(err)
      })

    // to get the today faculty Out data
    axios
      .get(baseUrl + "/today-Faculty-OutData")
      .then(result => {
        console.log("Today Faculty Out data is getting Successfully")
        // console.log(result.data)
        setFacultyOutData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Faculty Out data")
        console.log(err)
      })
  }, [isInUpdated, isOutUpdated])



  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleInSubmit = e => {
    e.preventDefault()

    if (inputRef.current) {
      inputRef.current = null
    }

    if (inSearchParameter.trim() === "") {
      toast.warn("Enter the Valid Number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }

    if (!isNaN(inSearchParameter) && inSearchParameter.length < 10) {
      const data = { facultyId: inSearchParameter.toUpperCase() }
      axios
        .post(baseUrl + "/add-Faculty-InData", data)
        .then(result => {
          if (result.status == 203) {
            toast.warn(
              `${inSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setInSearchParameter("")
            console.log(`${inSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
            )
          } else if (result.status === 205) {
            toast.error(`${inSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${inSearchParameter.toUpperCase()} data not Found`)
            setInSearchParameter("")
          } else {
            toast.success(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            console.log(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
            )
            console.log(result.data)
            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${inSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )

          setInSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    } else {
      const data = {
        roll: inSearchParameter.toUpperCase(),
      }
      axios
        .post(baseUrl + `/add-Student-InData`, data)
        .then(result => {
          console.log(result.data)
          if (result.status == 203) {
            toast.warn(
              `${inSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setInSearchParameter("")
            console.log(`${inSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "true")// to send the mails to the student
            setIsInUpdated(!isInUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} InTime is Updated Successfully`,
            )
          } else if (result.status == 201) {
            // console.log(result.data.data[0])
            toast.error(
              `${inSearchParameter.toUpperCase()} is in Suspend List.`,
              {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            setSelectedStudent(result.data.data[0])
            setModalOpen(true)
            console.log(`${inSearchParameter.toUpperCase()} is in Suspend List`)
            setInSearchParameter("")
          }
          else if (result.status == 204) {
            toast.success(
              `${inSearchParameter.toUpperCase()} In Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            console.log(`${inSearchParameter.toUpperCase()} In Time is Updated Successfully`)
            // sendMails(result.data , "false")// to send the mails to the student
            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
            )
          }
           else if (result.status === 205) {
            toast.error(`${inSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${inSearchParameter.toUpperCase()} data not Found`)
            setInSearchParameter("")
          } else {
            console.log("today data is getting successfully")
            console.log(result.data)

            toast.success(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student

            // for daily messages
            // console.log("Daily msg is getting")
            const dailysmsurl = process.env.REACT_APP_DAILY_SMS_API;
            axios.get(/* MESSAGE API */)
              .then(result => {
                console.log(`Successfully sent daily message to ${result.data.studentName}`);
              })
              .catch(er => {
                console.log("error coming for daily sms sending");
                console.log(er)
              })
            console.log(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
            )


            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Internal Server Error for ${inSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )
          setInSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    }
  }

  const handleOutSubmit = e => {
    e.preventDefault()

    if (inputRef.current) {
      inputRef.current = null
    }

    if (outSearchParameter.trim() === "") {
      toast.warn("Enter the Valid Number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }

    if (outSearchParameter.includes("VISITOR")) {
      console.log("This is for Visitor")
      const data = { passId: outSearchParameter }
      axios
        .put(baseUrl + "/update-Visitor-OutDate", data)
        .then(result => {
          // console.log(result.data);
          console.log(result.status)
          if(result.status === 206){
            toast.warn("Visitor Already Outed", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })
            setOutSearchParameter("")
          }
          else if (result.status === 202){
            console.log(result.status)
            toast.success("Visitor Outed", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })
            setOutSearchParameter("")
          }
        })
        .catch(err => {
          toast.error("Visitor Not Found", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          })
          setOutSearchParameter("")
          console.log(err)
        })
    } else if (!isNaN(outSearchParameter) && outSearchParameter.length < 10) {
      const data = { facultyId: outSearchParameter.toUpperCase() }
      axios
        .post(baseUrl + "/add-Faculty-Outdata", data)
        .then(result => {
          if (result.status == 203) {
            toast.warn(
              `${outSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setOutSearchParameter("")
            console.log(`${outSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully for ${outSearchParameter}`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
            )
          } else if (result.data.length === 0) {
            toast.error(`${outSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${outSearchParameter.toUpperCase()} data not Found`)

            setOutSearchParameter("")
          } else {
            toast.success(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            console.log(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
            )
            // console.log(result.data)
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${outSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )

          setOutSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    } else {
      const data = {
        roll: outSearchParameter.toUpperCase(),
      }
      axios
        .post(baseUrl + `/add-Student-OutData`, data)
        .then(result => {
          // console.log(result.data)
          if (result.status == 203) {
            toast.warn(
              `${outSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setOutSearchParameter("")
            console.log(`${outSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
            )
          } else if (result.status == 201) {
            // console.log(result.data.data[0])
            toast.error(
              `${outSearchParameter.toUpperCase()} is in Suspend List.`,
              {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            setSelectedStudent(result.data.Data[0])
            setModalOpen(true)
            console.log(
              `${outSearchParameter.toUpperCase()} is in Suspend List`,
            )
            setOutSearchParameter("")
          } else if (result.status === 205) {
            toast.error(`${outSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${outSearchParameter.toUpperCase()} data not Found`)
            setOutSearchParameter("")
          } else {
            console.log("today data is getting successfully")
            // console.log(result.data)

            toast.success(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            console.log(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
            )
            // console.log(result.data)
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${outSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

              theme: "light",
            },
          )
          setOutSearchParameter("")
          console.log(err.response.data)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    }
  }
  const handleInInputChange = e => setInSearchParameter(e.target.value)
  const handleOutInputChange = e => setOutSearchParameter(e.target.value)

  return (
    <div className="get-info-container">
      {modalOpen && (
        <ViewSuspendStudent
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          student={selectedStudent}
        />
      )}
      <div className="forms-container">
        <div className="form-section">
          <h1 className="label">In Moment</h1>
          <Label className="moment-form-label">
            Enter Student ID / Employee ID
          </Label>
          <AvForm onSubmit={handleInSubmit} className="form">
            <AvField
              name="inSearchParameter"
              type="text"
              errorMessage="Please enter search parameter"
              className="form-control input-field"
              value={inSearchParameter}
              onChange={handleInInputChange}
              placeholder="Scan code here"
              validate={{ required: { value: true } }}
              innerRef={inputRef}
              autoFocus
            />
            <Button type="submit" style={{ display: "none" }}>
              Submit
            </Button>
          </AvForm>
        </div>
        <div className="form-section">
          <h1 className="label">Out Moment</h1>
          <Label className="moment-form-label">
            Enter Student ID / Employee ID
          </Label>
          <AvForm onSubmit={handleOutSubmit} className="form">
            <AvField
              name="outSearchParameter"
              type="text"
              errorMessage="Please enter search parameter"
              className="form-control input-field"
              value={outSearchParameter}
              onChange={handleOutInputChange}
              placeholder="Scan code here"
              validate={{ required: { value: true } }}
              innerRef={inputRef}
              autoFocus
            />
            <Button type="submit" style={{ display: "none" }}>
              Submit
            </Button>
          </AvForm>
        </div>
      </div>

      <div className="tables-container">

        <StudentInOutTables
          studentInData={studentInData}
          studentOutData={studentOutData}
        />
        <FacultyInOutTables
          facultyInData={facultyInData}
          facultyOutData={facultyOutData}
        />
      </div>
      <ToastContainer />
    </div>
  )
}
export default connect(null, { setBreadcrumbItems })(GetInfo)
