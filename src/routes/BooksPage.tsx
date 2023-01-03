import { alpha, AppBar, Box, IconButton, InputBase, styled, Toolbar, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import { useDebounce } from "../tools"
import BookList from "./BookList"
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

export interface BookItemInterface {
    accessInfo: {
        accessViewStatus: string
        country: string
        embeddable: boolean
        epub: { isAvailable: false }
        pdf: { isAvailable: boolean, acsTokenLink: string }
        publicDomain: boolean
        quoteSharingAllowed: boolean
        textToSpeechPermission: string
        viewability: string
        webReaderLink: string
    },
    etag: string,
    id: string,
    kind: string,
    saleInfo: { country: string, isEbook: boolean, saleability: string },
    searchInfo: { textSnippet: string },
    selfLink: string
    volumeInfo: {
        allowAnonLogging: boolean,
        authors: string[],
        averageRating: number
        canonicalVolumeLink: string,
        categories: string[],
        contentVersion: string
        description: string,
        imageLinks: { smallThumbnail: string, thumbnail: string }
        industryIdentifiers: { identifier: string, type: string },
        infoLink: string,
        language: string
        maturityRating: string
        pageCount: number,
        panelizationSummary: { containsEpubBubbles: boolean, containsImageBubbles: boolean },
        previewLink: string,
        printType: string,
        publishedDate: string,
        publisher: string,
        ratingsCount: number,
        readingModes: { text: boolean, image: boolean },
        subtitle: string,
        title: string,
    }
}

export interface BooksResInterface {
    items: BookItemInterface[],
    kind: string,
    totalItems: number,
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    }
}));

async function getBooks(query: string) {
    const booksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const booksResData: BooksResInterface = await booksRes.json()
    return booksResData.items || []
}

export async function loader() {
    const bookRes: BookItemInterface[] = await getBooks('example books') as BookItemInterface[];
    return bookRes;
}


export default function BooksPage() {
    const initialBookList: BookItemInterface[] = useLoaderData() as BookItemInterface[]
    const [bookList, setBookList] = useState<BookItemInterface[]>(initialBookList)
    const [searchTerm, setSearchTerm] = useState<string>()
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleFavorites = (id: string): boolean => {
        const favoriteBookList = JSON.parse(localStorage.getItem('favoriteBooks') as string)
        const s = new Set(favoriteBookList)
        s.has(id) ? s.delete(id) : s.add(id);
        localStorage.setItem('favoriteBooks', JSON.stringify(Array.from(s)))
        return s.has(id)
    }

    const getFavoriteBookIdList = (): Set<string> => {
        const favoriteBookList: string[] = JSON.parse(localStorage.getItem('favoriteBooks') as string)
        return new Set<string>(favoriteBookList)
    }

    const searchHandler = useMemo(() => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value } = event.target
        setSearchTerm(prev => prev === value ? prev : value)
    }, [])

    useEffect(() => {
        if (!debouncedSearchTerm) return
        const fetchBooks = async (query: string) => {
            const fetchedBooks = await getBooks(query);
            setBookList(fetchedBooks);
        }
        fetchBooks(debouncedSearchTerm)
    }, [debouncedSearchTerm])

    const favoriteBookIdList: Set<string> = getFavoriteBookIdList()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Favorites Books App
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={searchHandler}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <BookList bookList={bookList} favoriteBookIdList={favoriteBookIdList} handleFavorites={handleFavorites} style={{ marginTop: 20 }} />
        </Box>
    );
}