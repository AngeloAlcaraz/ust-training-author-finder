// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import CssBaseline from '@mui/material/CssBaseline';
// import useScrollTrigger from '@mui/material/useScrollTrigger';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import ResponsiveAppBar from './responsiveAppBar.component';

// interface Props {
//   window?: () => Window;
//   children?: React.ReactElement<{ elevation?: number }>;
// }

// function ElevationScroll(props: Props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 0,
//     target: window ? window() : undefined,
//   });

//   return children
//     ? React.cloneElement(children, {
//         elevation: trigger ? 4 : 0,
//       })
//     : null;
// }

// export default function ElevateAppBar(props: Props) {
//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <ElevationScroll {...props}>
//        <ResponsiveAppBar />
//       </ElevationScroll>
//       <Toolbar />
//       <Container>
        
//       </Container>
//     </React.Fragment>
//   );
// }
