function XMLParser(xmlString: string) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    // Check for parser errors
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length) {
      throw new Error("Error parsing XML: " + parserError[0].textContent);
    }
    // Extract specific values from the XML
    const code = xmlDoc.getElementsByTagName("Code")[0]?.textContent || "";
    const message =
      xmlDoc.getElementsByTagName("Message")[0]?.textContent || "";
    const requestId =
      xmlDoc.getElementsByTagName("RequestId")[0]?.textContent || "";
    const hostId = xmlDoc.getElementsByTagName("HostId")[0]?.textContent || "";

    return {
      code,
      message,
      requestId,
      hostId,
    };
  } catch (error) {
    console.error("Failed to parse XML:", error);
    return null;
  }
}

export default XMLParser;
