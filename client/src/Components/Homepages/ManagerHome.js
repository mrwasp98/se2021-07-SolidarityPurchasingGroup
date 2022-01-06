import React from 'react';
import { Card, Button, ButtonGroup, Container, Alert } from "react-bootstrap";
import { PDFDownloadLink} from '@react-pdf/renderer';
import { useState } from 'react';
import dayjs from "dayjs";
import { useEffect } from 'react';
import {getReport } from '../../API/API'
import {Report} from '../Utilities/Report'

export default function ManagerHome(props) {
    //weekly report:
    const [wbeginDate, setWBeginDate] = useState(); //start date of the report
    const [wendDate, setWEndDate] = useState(); //end date of the report
    const [wdata, setWData] = useState([]); //data to be printed in the report
    const [wsummary, setWSummary] = useState([]); //summary data tu be printed in the report

    //monthly report
    const [mbeginDate, setMBeginDate] = useState(); //start date of the report
    const [mendDate, setMEndDate] = useState(); //end date of the report
    const [mdata, setMData] = useState([]); //data to be printed in the report
    const [msummary, setMSummary] = useState([]); //summary data tu be printed in the report

    const [showAlert, setShowAlert] = useState(""); //state that controls the error message

    const getWeekRange = (date) => {
        let wbeginDate;
        let wendDate;
        if (dayjs(date).format('dddd') === 'Saturday') {
          //wbeginDate is wednesday of this week
          wbeginDate = dayjs(date).startOf('week').add(3, 'day').format('YYYY-MM-DD');
          //wendDate is friday of this week (==yesterday since date is saturday)
          wendDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
        }
        else {
          //wbeginDate is wednesday of last week
          wbeginDate = dayjs(date).startOf('week').subtract(1, 'week').add(3, 'day').format('YYYY-MM-DD');
          //wendDate is friday of last week
          wendDate = dayjs(date).startOf('week').subtract(1, 'week').add(5, 'day').format('YYYY-MM-DD');
        }
        return [wbeginDate, wendDate];
      }

      const getMonthRange = (date) => {
        //Remember: dayjs has sunday as start of week and saturday as end of week
        const beginDate = dayjs(date).startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
        let endDate;
        if (dayjs(date).subtract(1, 'month').format('MMMM') === 'November' || dayjs(date).format('MMMM') === 'April' || dayjs(date).format('MMMM') === 'June' || dayjs(date).format('MMMM') === 'September') {
          endDate = dayjs(date).subtract(1, 'month').day(30).format('YYYY-MM-DD');
        }
        else if (dayjs(date).subtract(1, 'month').format('MMMM') === 'February') {
          endDate = dayjs(date).subtract(1, 'month').day(28).format('YYYY-MM-DD');
        }
        else {
          endDate = dayjs(date).subtract(1, 'month').day(31).format('YYYY-MM-DD');
        }
        return [beginDate, endDate];
      }

      const createSummary = (res, mod)=> {
        let x = res.map(el => {
            return { quantity: el.quantity, measure: el.measure }
        })
        var holder = {};
        x.forEach(function (d) {
            if (holder.hasOwnProperty(d.measure)) {
                holder[d.measure] = holder[d.measure] + d.quantity;
            } else {
                holder[d.measure] = d.quantity;
            }
        });
        var y = [];
        for (var prop in holder) {
            y.push({quantity: holder[prop], measure: prop});
        }
        if(mod ==="weekly")
        setWSummary(y);
        else
        setMSummary(y)
      }

    useEffect(() => {
        const [wbDate, weDate]  = getWeekRange(props.date)
        const [mbDate, meDate]  = getMonthRange(props.date)
        setWBeginDate(wbDate)
        setWEndDate(weDate)
        setMBeginDate(mbDate)
        setMEndDate(meDate)
    }, [props.date])

   //this use effect is used to show a error message
   useEffect(() => {
    setTimeout(() => {
        setShowAlert("");
    }, 1500);
}, [showAlert]);

    useEffect(() => {
        getReport(dayjs(props.date).format("YYYY-MM-DD"), "weekly")
        .then(res=>{
            console.log(res)
            setWData(res)
            createSummary(res, "weekly")
        })
        .catch(err=> setShowAlert("An error occured with the creation of the reports"))

        getReport(dayjs(props.date).format("YYYY-MM-DD"), "monthly")
        .then(res=>{
            console.log(res)
            setMData(res)
            createSummary(res, "monthly")
        })
        .catch(err=> setShowAlert("An error occured with the creation of the reports"))

    }, [props.date])

    return (
        <Container className="justify-content-center">
            <Card className="mt-4">
                <Card.Header as="h5">What do you want to do?</Card.Header>
                <Card.Body className="mb-2">
                    <ButtonGroup vertical aria-label="Directions" className="d-flex" >
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprod">
                            <PDFDownloadLink document={<Report data={wdata} beginDate={wbeginDate} endDate={wendDate} summary={wsummary} title={"SPG weekly report"}/>} 
                            fileName="SPG-weekly-report.pdf" className="py-2 yellowLink" style={{ minWidth: "100%", textDecoration: "none" }}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Get weekly report')}
                            </PDFDownloadLink>
                        </Button>

                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprod">
                            <PDFDownloadLink document={<Report data={mdata} beginDate={mbeginDate} endDate={mendDate}  summary={msummary} title={"SPG monthly report"}/>} 
                            fileName="SPG-monthly-report.pdf" className="py-2 yellowLink" style={{ minWidth: "100%", textDecoration: "none" }}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Get monthly report')}
                            </PDFDownloadLink>
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
            {showAlert &&
             <Alert className="position-fixed"
             style={{ bottom: '3rem', zIndex: '200', background: '#C1260B', color: "white" }} >
             {showAlert}
         </Alert>
            }
           
        </Container>
    );
}