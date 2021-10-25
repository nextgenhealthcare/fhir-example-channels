# Convert HL7 to FHIR Patient - Example 2
This example channel uses the FHIR Resource Builder code template type to take an HL7 v2.x ADT and create a FHIR Patient resource that represents the demographic information present in the message. It accomplishes the same thing as the "Example 1" channel, but in a different way. By using code templates, you can keep your conversion logic separate from channels, and include those code templates on multiple channels as you see fit.

This channel is dependent on the following code template libraries:
- HL7 v2.x to FHIR Helper Functions
- HL7 v2.x to FHIR Creation Functions

Other helpful reference pages:
- [Patient documentation page](http://hl7.org/fhir/R4/patient.html)
- [HL7 v2.x Patient mappings](http://hl7.org/fhir/R4/patient-mappings.html#v2)

The FHIR Connector Extension was previously a free-to-download pilot project. It is now available as part of our commerical offerings. If you're interested, please contact us at [mirthconnectsales@nextgen.com](matilto:mirthconnectsales@nextgen.com)! If you are already a customer, you can download the latest version of the extension (as well as the FHIR User Guide) on our client portal: [https://www.community.nextgen.com/](https://www.community.nextgen.com/)
