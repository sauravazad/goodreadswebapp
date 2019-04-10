import React, { Component } from "react";
import { getDataFromAPI } from "./util";
import "./App.css";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
// import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import { SnackbarProvider, withSnackbar } from "notistack";
import BookGrid from "./booksGrid";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 2
    // display: "flex",
    // alignItems: "center"
    // width: 300
  },
  input: {
    padding: 3,
    marginLeft: 8,
    flex: 1,
    width: 400
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  button: {
    margin: theme.spacing.unit
  }
});

class App extends Component {
  static formatData = data => {
    let { results, ...otherprops } = data;
    if (typeof results == "string") {
      results = {};
    }
    const { work: books = [] } = results;
    const flattned = books.map(book => {
      const { best_book = {} } = book;
      const { author = {} } = best_book;
      const final = {
        ...book,
        ...author,
        ...best_book
      };
      return final;
    });
    return {
      queryDetails: otherprops,
      books: flattned
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      queryDetails: {},
      books: [],
      pageIndex: 1
    };
    this.fetchResults = this.fetchResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async makeRequest(searchString, page) {
    try {
      const result = await getDataFromAPI(searchString, page);
      // console.log(result.data);
      return App.formatData(result.data);
    } catch (e) {
      throw Error(e.message);
    }
  }

  loadMore(event) {
    const { pageIndex } = this.state;
    this.makeRequest(this.state.value, pageIndex + 1)
      .then(result => {
        const { books, queryDetails } = result;
        if (result.books.length === 0) {
          this.showMessage("No more books to fetch!", "warning");
        }
        this.setState({
          pageIndex: pageIndex + 1,
          books: this.state.books.concat(books),
          queryDetails
        });
      })
      .catch(e => {
        console.error(e);
      });
    event.preventDefault();
  }

  fetchResults(event) {
    // console.log(this.state.value);
    this.makeRequest(this.state.value)
      .then(result => {
        if (result.books.length === 0) {
          this.showMessage("No Books found!", "warning");
        }
        this.setState({ ...result });
      })
      .catch(e => {
        console.error(e);
      });
    event.preventDefault();
  }

  showMessage = (msg, variant) => {
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar(msg, { variant });
  };
  render() {
    const { classes } = this.props;
    const { books } = this.state;
    // const classes = styles;
    return (
      <div className="App">
        <Paper elevation={1} className={classes.root}>
          <form onSubmit={this.fetchResults}>
            <Typography variant="subtitle1" id="modal-title">
              GoodReads API search
            </Typography>
            <InputBase
              className={classes.input}
              onChange={this.handleChange}
              style={{ border: "grey 1px", borderStyle: "solid", borderRadius: "5px" }}
              placeholder="Search for a Book"
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon />
            </IconButton>
          </form>
          {/* <Divider className={classes.divider} /> */}
        </Paper>
        <div>
          <BookGrid tileData={books} />
          {books && books.length ? (
            <Button onClick={this.loadMore} variant="contained" className={classes.button}>
              Load More
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
}

const ParentComponent = withSnackbar(withStyles(styles)(App));
// const MyApp = withSnackbar(App);

function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ParentComponent />
    </SnackbarProvider>
  );
}

export default IntegrationNotistack;
