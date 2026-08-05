import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Styles designed with deep contrast & enhanced typography for PDF print
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#F8FAFC", // Slate soft contrast background
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1E293B", // Deep navy accent
    paddingBottom: 10,
    marginBottom: 20,
  },
  breadcrumb: {
    fontSize: 9,
    color: "#64748B",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A", // Deep primary text
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
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1", // High contrast border
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 6,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  col3: {
    width: "33.33%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  col2: {
    width: "50%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  col1: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#334155", // Deep slate for labels
    marginBottom: 4,
    textTransform: "uppercase",
  },
  required: {
    color: "#DC2626",
  },
  valueBox: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#94A3B8", // High-contrast input borders
    borderRadius: 4,
    padding: 6,
    minHeight: 22,
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
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxSquare: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 2,
    marginRight: 5,
    backgroundColor: "#FFFFFF",
  },
  checkboxLabel: {
    fontSize: 9,
    color: "#1E293B",
  },
});

// Helper component for styled form fields
const FormField = ({ label, value, placeholder, required, style }) => (
  <View style={style}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <View style={styles.valueBox}>
      <Text style={value ? styles.valueText : styles.placeholderText}>
        {value || placeholder}
      </Text>
    </View>
  </View>
);

export const CallLogPDF = ({ formData = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.breadcrumb}>CRM › Call Log › New Call Log</Text>
          <Text style={styles.title}>New Call Log</Text>
        </View>
        <Text style={styles.badge}>Not Saved</Text>
      </View>

      {/* 1. Call Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Call Details</Text>
        <View style={styles.grid}>
          <FormField
            style={styles.col3}
            label="Call No"
            required
            value={formData.callNo}
            placeholder="Enter call number"
          />
          <FormField
            style={styles.col3}
            label="Date"
            required
            value={formData.date}
            placeholder="dd/mm/yyyy"
          />
          <FormField
            style={styles.col3}
            label="Hospital / Customer"
            required
            value={formData.hospital}
            placeholder="Enter hospital name"
          />
          <FormField
            style={styles.col3}
            label="Department"
            value={formData.department}
            placeholder="Enter department"
          />
          <FormField
            style={styles.col3}
            label="Contact Person"
            value={formData.contactPerson}
            placeholder="Enter contact person"
          />
          <FormField
            style={styles.col3}
            label="Mobile"
            value={formData.mobile}
            placeholder="Enter mobile number"
          />
          <FormField
            style={styles.col3}
            label="Engineer"
            value={formData.engineer}
            placeholder="Enter engineer name"
          />
        </View>
      </View>

      {/* 2. Equipment Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Equipment Details</Text>
        <View style={styles.grid}>
          <FormField
            style={styles.col3}
            label="Equipment Name"
            value={formData.equipmentName}
            placeholder="Enter equipment name"
          />
          <FormField
            style={styles.col3}
            label="Make"
            value={formData.make}
            placeholder="Enter make"
          />
          <FormField
            style={styles.col3}
            label="Model"
            value={formData.model}
            placeholder="Enter model"
          />
          <FormField
            style={styles.col3}
            label="Serial No"
            value={formData.serialNo}
            placeholder="Enter serial number"
          />
          <FormField
            style={styles.col3}
            label="Asset ID"
            value={formData.assetId}
            placeholder="Enter asset ID"
          />
        </View>
      </View>

      {/* 3. Service Details & Service Types */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Service Details</Text>
        <View style={styles.grid}>
          <FormField
            style={styles.col1}
            label="Complaint Reported"
            value={formData.complaintReported}
            placeholder="Enter complaint details"
          />
        </View>

        <Text style={[styles.label, { marginTop: 6 }]}>Service Types</Text>
        <View style={styles.checkboxContainer}>
          {["Breakdown", "PM", "Installation", "Calibration", "Inspection"].map(
            (type) => (
              <View key={type} style={styles.checkboxItem}>
                <View style={styles.checkboxSquare} />
                <Text style={styles.checkboxLabel}>{type}</Text>
              </View>
            ),
          )}
        </View>
      </View>

      {/* 4. Action Taken */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Action Taken</Text>
        <FormField
          style={styles.col1}
          label="Action Details"
          value={formData.actionTaken}
          placeholder="Enter action taken"
        />
      </View>

      {/* 5. Spare Parts Used */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Spare Parts Used</Text>
        <FormField
          style={styles.col1}
          label="Spare Parts Details"
          value={formData.spareParts}
          placeholder="Enter spare parts details"
        />
      </View>

      {/* 6. Equipment Status */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Equipment Status</Text>
        <View style={styles.checkboxContainer}>
          {["Breakdown", "PM", "Installation", "Calibration", "Inspection"].map(
            (type) => (
              <View key={type} style={styles.checkboxItem}>
                <View style={styles.checkboxSquare} />
                <Text style={styles.checkboxLabel}>{type}</Text>
              </View>
            ),
          )}
        </View>
      </View>
    </Page>
  </Document>
);
