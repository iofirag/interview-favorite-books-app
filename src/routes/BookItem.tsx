import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { BookItemInterface } from './BooksPage';
import { Checkbox } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

interface BookItemProps {
    book: BookItemInterface;
    handleFavorites: (id: string) => boolean;
    isFavorite: boolean;
    children: any;
}

export default function BookItem(props: BookItemProps) {
    const { book } = props
    const [checked, setChecked] = useState<boolean>(props.isFavorite)

    const checkedHandler = (id: string) => {
        const shouldCheck = props.handleFavorites(id)
        setChecked(shouldCheck)
    }

    return (
        <Paper
            onClick={() => console.log(book.id)}
            sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={2}>
                <Grid item>
                    <ButtonBase sx={{ width: 128, height: 128 }}>
                        <Img alt="complex" src={book.volumeInfo.imageLinks.thumbnail} />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                <b>Title: </b> {book.volumeInfo.title}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                <b>Description:</b> {book.volumeInfo.description ?
                                    book.volumeInfo.description.length > 30 ?
                                        `${book.volumeInfo.description.slice(0, 60)}...`
                                        : book.volumeInfo.description
                                    : '(empty)'}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                <b>Authors:</b> {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '(empty)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {book.id}
                            </Typography>

                            {/*  */}
                            <Grid item>
                                <Typography variant="subtitle1" component="div">
                                    <Checkbox checked={checked} onClick={() => checkedHandler(book.id)} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                                </Typography>
                            </Grid>
                            <a rel="noopener noreferrer" href={book.volumeInfo.previewLink} target="_blank">Show more</a>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}