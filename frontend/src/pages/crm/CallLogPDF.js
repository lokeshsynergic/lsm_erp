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
    marginHorizontal: -5,
    marginBottom: 5,
  },
  col3: {
    width: "33.33%",
    paddingHorizontal: 5,
    marginBottom: 8, // Reduced from 10 to tighten field rows
  },
  col1: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 8, // Reduced from 10
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 2, // Reduced from 4
    textTransform: "uppercase",
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
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#94A3B8",
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
          <Text style={styles.title}>Life Safe Medical</Text>
        </View>
        <Text style={styles.badge}>Call # {formData.callNo}</Text>
      </View>

      {/* Call Details Section */}

      <Text style={styles.sectionTitle}>Call Details</Text>
      <View style={styles.grid}>
        <FormField
          style={styles.col3}
          label="Call No"
          value={formData.callNo}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Date"
          value={formData.date}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Hospital / Customer"
          value={formData.hospital}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Department"
          value={formData.department}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Contact Person"
          value={formData.contactPerson}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Mobile"
          value={formData.mobile}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Engineer"
          value={formData.engineer}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label=" Status"
          value={formData.status}
          placeholder="-"
        />
      </View>

      {/* Equipment Details Section */}
      <Text style={styles.sectionTitle}>Equipment Details</Text>
      <View style={styles.grid}>
        <FormField
          style={styles.col3}
          label="Equipment Name"
          value={formData.equipmentName}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Make"
          value={formData.make}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Model"
          value={formData.model}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Serial No"
          value={formData.serialNo}
          placeholder="-"
        />
        <FormField
          style={styles.col3}
          label="Asset ID"
          value={formData.assetId}
          placeholder="-"
        />
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
    </Page>
  </Document>
);
