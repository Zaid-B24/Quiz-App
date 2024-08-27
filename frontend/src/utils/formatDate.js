const formatDate = (dateString) => {
    const parsedTimestamp = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedTimestamp = parsedTimestamp.toLocaleDateString(
      'en-GB',
      options
    );
  
    return formattedTimestamp;
  };
  
  export default formatDate;
  