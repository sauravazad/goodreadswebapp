import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
// import Modal from "@material-ui/core/Modal";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import Dialog from "@material-ui/core/Dialog";
import { getReviewDataFromAPI } from "./util";

function createMarkup(data) {
  return { __html: data };
}

function getMarkUp(htmlString) {
  return <div dangerouslySetInnerHTML={createMarkup(htmlString)} />;
}
const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: "95%",
    height: "95%"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  image: {
    width: 128,
    height: 128
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  }
});

class TitlebarGridList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBook: {},
      bookInfo: {},
      open: false,
      fullWidth: true
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleOpen(book) {
    //  fetch the review for book
    getReviewDataFromAPI(book.id)
      .then(request => {
        const { data = {} } = request;
        const { book: bookInfo } = data;
        console.log(bookInfo);
        this.setState({ bookInfo });
      })
      .catch(e => {
        console.error(e);
      });
    this.setState({ open: true, currentBook: book });
  }
  handleClose() {
    this.setState({ open: false, currentBook: {}, bookInfo: {} });
  }
  render() {
    const { classes, tileData } = this.props;
    const { currentBook = {}, bookInfo } = this.state;
    const { best_book = {} } = currentBook;
    return (
      <div className={classes.root}>
        <GridList spacing={10} className={classes.gridList} cols={6}>
          {tileData.map(tile => (
            <GridListTile key={`${tile.id}_${tile.books_count}_${tile.ratings_count}`}>
              <ButtonBase className={classes.image}>
                <img className={classes.img} src={tile.image_url} alt={tile.title} />
              </ButtonBase>
              {/* <img src={tile.image_url} alt={tile.title} /> */}
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.name}</span>}
                actionIcon={
                  <IconButton className={classes.icon} onClick={() => this.handleOpen(tile)}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={"md"}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            <DialogContentText>{currentBook.title}</DialogContentText>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} src={currentBook.image_url} alt={currentBook.title} />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography variant="subtitle2" id="modal-title2">
                      {currentBook.name}
                    </Typography>
                    <Typography color="textSecondary">ID: {best_book.id}</Typography>
                    <Typography color="textSecondary">ISBN: {bookInfo.isbn}</Typography>
                    <Typography color="textSecondary">Publisher: {bookInfo.publisher}</Typography>
                    <Typography color="textSecondary">Pages: {bookInfo.num_pages}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle2">Rating {currentBook.average_rating}</Typography>
                  <Typography color="textSecondary">Count {currentBook.ratings_count}</Typography>
                  <Typography color="textSecondary">Language: {bookInfo.language_code}</Typography>
                </Grid>
              </Grid>
              {bookInfo.description ? (
                <Grid item>
                  <Typography variant="subtitle1">Description</Typography>
                  <Typography color="textSecondary" variant="subtitle1">
                    {getMarkUp(bookInfo.description)}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle1">
                    {getMarkUp(bookInfo.reviews_widget)}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
