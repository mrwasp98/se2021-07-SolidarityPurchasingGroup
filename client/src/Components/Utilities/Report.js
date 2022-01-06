import dayjs from "dayjs";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

export {Report}

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
