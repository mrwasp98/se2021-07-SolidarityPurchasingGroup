import React from 'react';
import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useState } from 'react';
import dayjs from "dayjs";
import { useEffect } from 'react';
import {getReport } from '../../API/API'

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'col'
    },
    title: {
        backgroundColor: '#143642',
        color: 'white',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    text: {
        marginBottom: 5
    },
    table: {
        width: '100%',
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 8,
        borderBottom: '1px solid black'
    },
    col: {
        marginLeft: 20,
        width: "33%"
    },
    header: {
        backgroundColor: '#797877',
        color: '#E4E4E4'
    },
    summaryHeader: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        fontSize: 30
    },
    summary: {
        marginLeft: 20
    }
});


// Create Document Component
const Report = (props) => (
    <Document title={props.title}>
        <Page size="A4" style={styles.page}>
            <View style={styles.title} fixed>
                <Text style={styles.text}>{props.title}</Text>
                <Text style={styles.text}>{dayjs(props.beginDate).format('DD/MM/YYYY')} to {dayjs(props.endDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.table}>
                <View style={[styles.row, styles.header]} fixed>
                    <Text style={[styles.header, styles.col]}>Product Name</Text>
                    <Text style={[styles.header, styles.col]}>Farmer</Text>
                    <Text style={[styles.header, styles.col]}>Quantity</Text>
                </View>
                {
                    props.data.map((el, i) =>
                    (<View key={i} style={styles.row} wrap={false}>
                        <Text style={styles.col}>{el.name}</Text>
                        <Text style={styles.col}>{el.farmerName} {el.farmerSurname}</Text>
                        <Text style={styles.col}>{el.quantity} {el.measure}</Text>
                    </View>)
                    )
                }
            </View>
        </Page>
        <Page>
            <View style={styles.title} fixed>
                <Text style={styles.text}>{props.title}</Text>
                <Text style={styles.text}>{dayjs(props.beginDate).format('DD/MM/YYYY')} to {dayjs(props.endDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View>
                <Text style={[styles.text, styles.summaryHeader, styles.summary]}>Summary:</Text>
                {
                    props.summary.map((el, i)=>(
                        <Text key={i} style={[styles.text, styles.summary]}>Wasted {el.measure}: {el.quantity}</Text>
                    ))
                }
            </View>
            <View style={[styles.title, styles.footer]}>
                <Text>End of report</Text>
            </View>
        </Page>
    </Document>
);

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

    useEffect(() => {
        getReport(props.date, "weekly")
        .then(res=>{
            console.log(res)
            setWData(res)
            createSummary(res, "weekly")
        })
        .catch(err=> console.log(err))

        getReport(props.date, "monthly")
        .then(res=>{
            console.log(res)
            setMData(res)
            createSummary(res, "monthly")
        })
        .catch(err=> console.log(err))

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
        </Container>
    );
}