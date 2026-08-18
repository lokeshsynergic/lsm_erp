import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../image/lsm_logo.jpeg";
import { AlignCenter } from "lucide-react";

// Styles for compact document layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1E293B",
    paddingBottom: 5,
    marginBottom: 5,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  badge: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontWeight: "bold",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 2, // 👈 Force header directly against the element above
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 4,
    marginBottom: 6, // 👈 Reduce gap below header title
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    //marginHorizontal: -5,
    marginBottom: 5,
  },
  col3: {
    width: "33.33%",
    padding: 5,
    marginBottom: 8,
  },

  col6: {
    width: "66.66%",
    padding: 5,
    marginBottom: 8,
  },

  col1: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 8, // Reduced from 10
  },
  // label: {
  //   fontSize: 8,
  //   fontWeight: "bold",
  //   color: "#334155",
  //   marginBottom: 2, // Reduced from 4
  //   textTransform: "uppercase",
  // },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#334155",
    textTransform: "uppercase",
  },

  fieldvalue: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#0F172A",
  },
  required: {
    color: "#DC2626",
  },
  valueBox: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#94A3B8",
    borderRadius: 4,
    padding: 5,
    minHeight: 20, // Reduced from 22
  },
  valueText: {
    fontSize: 9,
    color: "#0F172A",
  },
  placeholderText: {
    fontSize: 9,
    color: "#64748B",
    fontStyle: "italic",
  },
  largeValueBox: {
    // backgroundColor: "#F1F5F9",
    borderWidth: 0,
    //borderColor: "#94A3B8",
    borderRadius: 4,
    padding: 6,
    minHeight: 70, // 👈 Reduced height to prevent vertical expansion
    marginBottom: 2, // 👈 Eliminates space below the box
  },
  largeValueText: {
    fontSize: 9,
    color: "#0F172A",
    lineHeight: 1.3,
  },
  largePlaceholderText: {
    fontSize: 9,
    color: "#64748B",
    fontStyle: "italic",
    lineHeight: 1.3,
  },

  /* --- Pin Footer & Signatures to Page Bottom --- */
  footerSection: {
    position: "absolute",
    bottom: 25,
    left: 30,
    right: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  signatureContainer: {
    width: 220,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1E293B",
  },
  websiteText: {
    fontSize: 10,
    textAlign: "center",
    color: "#64748B",
  },
});

// Helper component for styled form fields

const FormField = ({ label, value, placeholder, style }) => (
  <View style={style}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueBox}>
      <Text style={value ? styles.valueText : styles.placeholderText}>
        {value || placeholder}
      </Text>
    </View>
  </View>
);

// Large text box component for notes/write-in fields
const LargeTextBox = ({ value, placeholder }) => (
  <View style={styles.largeValueBox}>
    <Text style={value ? styles.largeValueText : styles.largePlaceholderText}>
      {value || placeholder}
    </Text>
  </View>
);

export const CallLogPDF = ({ formData = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image src={logo} style={styles.logo} />
        <View>
          <Text style={styles.title}>Life Safe Medical{"\n"}</Text>
          <Text style={{ textAlign: "center", fontSize: 10, color: "#1E293B" }}>
            Service Report{" "}
          </Text>
        </View>
        <Text style={styles.badge}>
          Date {formData.date || new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Call Details Section */}

      <Text style={styles.sectionTitle}>Call Details</Text>
      <View style={styles.grid}>
        {/* Row 1 */}
        <Text style={styles.col3}>
          <Text style={styles.label}>Call No : </Text>
          <Text style={styles.fieldvalue}>{formData.callNo || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Call Date : </Text>
          <Text style={styles.fieldvalue}>{formData.date || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Department : </Text>
          <Text style={styles.fieldvalue}>{formData.department || "-"}</Text>
        </Text>

        {/* Row 2 */}
        <Text style={styles.col6}>
          <Text style={styles.label}>Hospital / Customer : </Text>
          <Text style={styles.fieldvalue}>{formData.hospital}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Contact Person : </Text>
          <Text style={styles.fieldvalue}>{formData.contactPerson}</Text>
        </Text>
        {/* Row 3 */}

        <Text style={styles.col3}>
          <Text style={styles.label}>Mobile : </Text>
          <Text style={styles.fieldvalue}>{formData.mobile}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Engineer : </Text>
          <Text style={styles.fieldvalue}>{formData.engineer}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Status : </Text>
          <Text style={styles.fieldvalue}>{formData.status}</Text>
        </Text>
      </View>

      {/* Equipment Details Section */}
      <Text style={styles.sectionTitle}>Equipment Details</Text>
      <View style={styles.grid}>
        <Text style={styles.col3}>
          <Text style={styles.label}>Equipment Name : </Text>
          <Text style={styles.fieldvalue}>{formData.equipmentName || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Make : </Text>
          <Text style={styles.fieldvalue}>{formData.make || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Model : </Text>
          <Text style={styles.fieldvalue}>{formData.model || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Serial No : </Text>
          <Text style={styles.fieldvalue}>{formData.serialNo || "-"}</Text>
        </Text>
        <Text style={styles.col3}>
          <Text style={styles.label}>Asset ID : </Text>
          <Text style={styles.fieldvalue}>{formData.assetId || "-"}</Text>
        </Text>

        <Text style={styles.col3}>
          <Text style={styles.label}>Service Type : </Text>
          <Text style={styles.fieldvalue}>{formData.service_type || "-"}</Text>
        </Text>
      </View>

      {/* Complaint Reported */}
      <Text style={styles.sectionTitle}>Complaint Reported</Text>
      <LargeTextBox value={formData.complaintReported} placeholder="" />

      {/* Action Taken */}
      <Text style={styles.sectionTitle}>Action Taken</Text>
      <LargeTextBox value={formData.actionTaken} placeholder="" />

      {/* Spare Parts Details */}
      <Text style={styles.sectionTitle}>Spare Parts Used</Text>
      <LargeTextBox value={formData.spareParts} placeholder="" />
      <View style={styles.footerSection}>
        <View style={styles.signatureRow}>
          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Engineer's Signature</Text>
          </View>
          <View style={styles.signatureContainer}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Customer's Signature</Text>
          </View>
        </View>

        <Text style={styles.websiteText}>
          (Visit us: https://lifesafemedical.org.in/)
        </Text>
      </View>
    </Page>
  </Document>
);
