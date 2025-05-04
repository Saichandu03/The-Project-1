import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "store/actions";
import { connect } from "react-redux";
import { Col, Row, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import ApexChart from "./newBarChart";
import PieChart from "./newPieChart";
import Chartapex from "./newLineChat";
import axios from "axios";

function Dashboard(props) {
  const [selectedOption, setSelectedOption] = useState('ALL');
  const [clgs, setClgs] = useState([]);
  const [numdata, setNUM] = useState([]);
  const [namdata, setNAM] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [pasting, setPasting] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const BaseUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const breadcrumbItems = [
      { title: "Late Comers", link: "#" },
      { title: "Dashboard", link: "#" },
    ];
    props.setBreadcrumbItems("Dashboard", breadcrumbItems);
  }, [props]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedStartDate = startDate;
        const formattedEndDate = endDate;

        // Fetch college names
        const clgRes = await axios.get(`${BaseUrl}/get-clg-names`);
        const collegeNamesWithAll = [{ collegeName: "ALL" }, ...clgRes.data].sort(
          (a, b) => (b.collegeName.localeCompare(a.collegeName))
        );
        setClgs(collegeNamesWithAll);

        console.log("This is for testing")
        console.log({
          selectedOption,
          startDate: new Date(formattedStartDate),
          endDate: new Date(formattedEndDate),
        })
        // Fetch branchwise data
        const branchwiseRes = await axios.post(`${BaseUrl}/get-branchwise`, {
          selectedOption,
          startDate: new Date(formattedStartDate),
          endDate: new Date(formattedEndDate),
        });
        const branchData = branchwiseRes.data.length
          ? branchwiseRes.data.map(item => ({
              name: item._id,
              totalStudents: item.totalStudents,
            })).sort((a, b) => b.totalStudents - a.totalStudents)
          : [{ name: "No Data", totalStudents: 0 }];

        setNUM(branchData.map(item => item.totalStudents));
        setNAM(branchData.map(item => item.name));

        // Fetch gender data
        const genderRes = await axios.post(`${BaseUrl}/get-gender`, {
          selectedOption,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
        setGenderData(genderRes.data.length ? genderRes.data : [{ _id: null, Female: 0, Male: 0 }]);

        // Fetch past 7 days data
        const pastingRes = await axios.get(`${BaseUrl}/get-visitor-seven`);
        setPasting(pastingRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOption, startDate, endDate, BaseUrl]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', fontWeight: '600', fontSize: '35px', paddingBottom: '20px' }}>Late Comers</div>

      {/* Render Dropdowns */}
      {clgs.length > 0 && (
        <Row style={{ marginBottom: '20px' }}>
          <Col lg="6" className="d-flex align-items-center justify-content-center mb-3">
            <label htmlFor="chartSelector" className="me-2" style={{ fontSize: '24px' }}>Select College:</label>
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} style={{ width: '250px' }}>
              <DropdownToggle className="btn btn-sm w-100" caret>
                {selectedOption.length > 35 ? selectedOption.substring(0, 35) : selectedOption} <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu>
                {clgs.map((option, index) => (
                  <DropdownItem key={index} onClick={() => setSelectedOption(option.collegeName)}>
                    {option.collegeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>

          <Col lg="6" className="d-flex justify-content-evenly">
            <div className="d-flex align-items-center">
              <label className="me-1" style={{ fontSize: 16 }}>From:</label>
              <input
                className="form-control"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="d-flex align-items-center">
              <label className="me-1" style={{ fontSize: 16 }}>To:</label>
              <input
                className="form-control"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </Col>
        </Row>
      )}

      {/* Render Charts */}
      {numdata.length > 0 && namdata.length > 0 && (
        <Row>
          <Col lg="8">
            <h3>{selectedOption === 'ALL' ? "ALL Colleges" : selectedOption}</h3>
            <ApexChart numdata={numdata} namdata={namdata} />
          </Col>
          {genderData.length > 0 && (
            <Col lg="4">
              <PieChart Data={genderData} />
            </Col>
          )}
        </Row>
      )}

      <br /><br /><br />
      {pasting.length > 0 && (
        <Row>
          <Chartapex Data={pasting} />
        </Row>
      )}
      <br />
    </>
  );
}

export default connect(null, { setBreadcrumbItems })(Dashboard);
