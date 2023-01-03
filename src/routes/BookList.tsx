import { Box, Grid } from "@mui/material";
import BookItem from "./BookItem";
import { BookItemInterface } from "./BooksPage";


interface BookListProps {
    bookList: BookItemInterface[];
    handleFavorites: (id: string) => boolean;
    favoriteBookIdList: Set<string>;
    style?: React.CSSProperties;
}

export default function BookList(props: BookListProps) {
    return (
        <Box style={props.style} sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(props.bookList).map((book, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <BookItem isFavorite={props.favoriteBookIdList.has(book.id)} book={book} key={book.id} handleFavorites={props.handleFavorites}>{book.volumeInfo.title}</BookItem>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}