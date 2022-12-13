import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import { styled } from '@mui/system';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Typography, Button } from '@material-ui/core';

const baseURL = "https://qyvx3lq5fj.execute-api.us-east-1.amazonaws.com/Prod/api/";
// const baseURL = "https://localhost:44347/api/"
const autoCompleteApiPath = "PostCode/GetAutoComplete/";
const getPostCodeDetailApiPath = "PostCode/GetPostCodeDetail/";

const StyledTypography = styled(Typography)({
  fontFamily: 'Montserrat',
});
const useStyles = makeStyles((theme) => ({
  root: {
    height: 350,
    width: '50%',
    marginLeft: '10px',
    padding: 0,
    backgroundColor: '#DEE7F5'
  },
}));

function App() {
  const [post, setPost] = React.useState([
    { label: '', value: '0' }]);
  const [postCodeInfo, setPostCodeInfo] = React.useState({
    PostCode: '',
    Country: '',
    Region: '',
    AdminDistrict: '',
    ParliamentaryConstituency: '',
    Area: ''
  });

  const classes = useStyles();
  return (
    <div className="App" >
      <div className="ag-theme-alpine" style={{ height: 50, width: '100%' }}>
        <div className={classNames('container-fluid', 'lg-p-bottom')} style={{ backgroundColor: '#182A3A', padding: '50px' }}>
          <StyledTypography variant='h1' sx={{ fontSize: '3.9rem' }} style={{ color: 'white' }}><i>Postcode Info for the UK</i></StyledTypography>
        </div>
        <Box pt={2}>
          <div style={{ margin: 10 }} >
            <StyledTypography variant='h4'>Please Enter Postcode</StyledTypography><br />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={post}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Enter Postcode" />}
              onInputChange={(event, newInputValue) => {
                axios.get(baseURL + autoCompleteApiPath + newInputValue).then((response) => {
                  var postCodes = response.data.map((x) => {
                    return { label: x, value: x };
                  });
                  setPost(postCodes);
                });
              }}
              onChange={(event, value, reason) => {
                const postCode = value.value;
                if (postCode != "" && postCode != "0") {
                  axios.get(baseURL + getPostCodeDetailApiPath + postCode).then((response) => {
                    const postCodeDetails = {
                      PostCode: postCode,
                      Country: response.data.country,
                      Region: response.data.region == null ? 'N/A' : response.data.region,
                      AdminDistrict: response.data.adminDistrict,
                      ParliamentaryConstituency: response.data.parliamentaryConstituency,
                      Area: response.data.area
                    }
                    setPostCodeInfo(postCodeDetails);
                  });
                }
              }}
            />
          </div>
        </Box>
        <br /><br />
        <Card className={classes.root} raised hidden={postCodeInfo.PostCode == ""}>
          <CardContent style={{ padding: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box flexGrow={1}>
              <StyledTypography variant='h1' sx={{ fontSize: '2.0rem', fontWeight: 'bold' }} ><u>Postcode : {postCodeInfo.PostCode}</u></StyledTypography>
              <Typography style={{ paddingTop: 20, paddingBottom: 20, fontSize: '25px' }}>
                <b>Country :</b> {postCodeInfo.Country}<br />
                <b>Region :</b> {postCodeInfo.Region}<br />
                <b>Admin District :</b> {postCodeInfo.AdminDistrict}<br />
                <b>Parliamentary Constituency :</b> {postCodeInfo.ParliamentaryConstituency}<br />
                <b>Area :</b> {postCodeInfo.Area}<br />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
