import React from 'react';
import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useState } from 'react';
import dayjs from "dayjs";
import { useEffect } from 'react';
import {getWeeklyReport } from '../../API/API'

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
    <Document title="SPG Weekly report">
        <Page size="A4" style={styles.page}>
            <View style={styles.title} fixed>
                <Text style={styles.text}>SPG - Weekly report</Text>
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
                <Text style={styles.text}>SPG - Weekly report</Text>
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
    const [beginDate, setBeginDate] = useState(); //start date of the report
    const [endDate, setEndDate] = useState(); //end date of the report

    const [data, setData] = useState([]); //data to be printed in the report
    const [summary, setSummary] = useState([]); //summary data tu be printed in the report
   
    const wreport = [
        {
            productid: 1,
            name: "mela",
            quantity: 3,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 2,
            name: "patate",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        }, {
            productid: 3,
            name: "cipolle",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 4,
            name: "uova",
            quantity: 2,
            measure: "units",
            farmerName: "Faye",
            farmerSurname: "Total"
        }, {
            productid: 1,
            name: "mela",
            quantity: 3,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 2,
            name: "patate",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        }, {
            productid: 3,
            name: "cipolle",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 4,
            name: "uova",
            quantity: 2,
            measure: "units",
            farmerName: "Faye",
            farmerSurname: "Total"
        }, {
            productid: 1,
            name: "mela",
            quantity: 3,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 2,
            name: "patate",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        }, {
            productid: 3,
            name: "cipolle",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 4,
            name: "uova",
            quantity: 2,
            measure: "units",
            farmerName: "Faye",
            farmerSurname: "Total"
        }, {
            productid: 1,
            name: "mela",
            quantity: 3,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 2,
            name: "patate",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        }, {
            productid: 3,
            name: "cipolle",
            quantity: 1,
            measure: "kg",
            farmerName: "Spike",
            farmerSurname: "Spiegel"
        },
        {
            productid: 4,
            name: "uova",
            quantity: 2,
            measure: "units",
            farmerName: "Faye",
            farmerSurname: "Total"
        }
    ]

    const getWeekRange = (date) => {
        let beginDate;
        let endDate;
        if (dayjs(date).format('dddd') === 'Saturday') {
          //beginDate is wednesday of this week
          beginDate = dayjs(date).startOf('week').add(3, 'day').format('YYYY-MM-DD');
          //endDate is friday of this week (==yesterday since date is saturday)
          endDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
        }
        else {
          //beginDate is wednesday of last week
          beginDate = dayjs(date).startOf('week').subtract(1, 'week').add(3, 'day').format('YYYY-MM-DD');
          //endDate is friday of last week
          endDate = dayjs(date).startOf('week').subtract(1, 'week').add(5, 'day').format('YYYY-MM-DD');
        }
        return [beginDate, endDate];
      }

    useEffect(() => {
        const [bDate, eDate]  = getWeekRange(props.date)
        setBeginDate(bDate)
        setEndDate(eDate)
    }, [props.date])

    useEffect(() => {
        getWeeklyReport(props.date)
        .then(res=>{
            setData(res)
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
            console.log(y);
            setSummary(y);
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
                            <PDFDownloadLink document={<Report data={data} beginDate={beginDate} endDate={endDate} summary={summary}/>} fileName="SPG-weekly-report.pdf" className="py-2 yellowLink" style={{ minWidth: "100%", textDecoration: "none" }}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Get weekly report')}
                            </PDFDownloadLink>
                        </Button>

                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprod">
                            <PDFDownloadLink document={<Report data={data} beginDate={beginDate} endDate={endDate}  summary={summary}/>} fileName="SPG-monthly-report.pdf" className="py-2 yellowLink" style={{ minWidth: "100%", textDecoration: "none" }}>
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Get monthly report')}
                            </PDFDownloadLink>
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}