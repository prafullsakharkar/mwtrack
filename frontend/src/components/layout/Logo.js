import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  return (
    <Root className="flex">
      {/* <img className="logo-icon w-32 h-32" src="assets/images/logo/logo.svg" alt="logo" /> */}

      <div
        className="badge flex py-4 px-8 mx-8 rounded-8"
        style={{ backgroundColor: "#121212", color: "#61DAFB" }}
      >
        <h1>MWTracks</h1>
      </div>
    </Root>
  );
}

export default Logo;
