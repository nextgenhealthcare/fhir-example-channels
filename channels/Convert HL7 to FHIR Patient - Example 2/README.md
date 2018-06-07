# Convert HL7 to FHIR Patient - Example 2
This example channel uses the FHIR Resource Builder code template type to take an HL7 v2.x ADT and create a FHIR Patient resource that represents the demographic information present in the message. It accomplishes the same thing as the "Example 1" channel, but in a different way. By using code templates, you can keep your conversion logic separate from channels, and include those code templates on multiple channels as you see fit.

This channel is dependent on the following code template libraries:
- HL7 v2.x to FHIR Helper Functions
- HL7 v2.x to FHIR Creation Functions

Other helpful reference pages:
- [Patient documentation page](http://hl7.org/fhir/STU3/patient.html)
- [HL7 v2.x Patient mappings](http://hl7.org/fhir/STU3/patient-mappings.html#v2)

For more information, check out our [public wiki](https://www.mirthcorp.com/community/wiki/display/mirth/HL7+v2.x+to+FHIR+Conversions#HL7v2.xtoFHIRConversions-ConvertHL7toFHIRPatient-Example2)!