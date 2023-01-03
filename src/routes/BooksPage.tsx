import { alpha, AppBar, Box, IconButton, InputBase, Pagination, styled, Toolbar, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLoaderData } from "react-router-dom"
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

const PAGE_ITEMS: number = 6;
const START_SEARCH_TERM: string = 'example books';

async function getBooks(query: string, startIndex: number = 1) {
    const booksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?startIndex=${startIndex}&maxResults=${PAGE_ITEMS}&q=${query}`);
    const booksResData = await booksRes.json() as BooksResInterface
    return {
        items: booksResData.items || [],
        kind: booksResData.kind || '',
        totalItems: booksResData.totalItems || 0,
    }
}

export async function loader() {
    return await getBooks(START_SEARCH_TERM);
}


export default function BooksPage() {
    const initBooksResData: BooksResInterface = useLoaderData() as BooksResInterface;
    const [bookResData, setBookResData] = useState<{
        totalItems: number,
        currentPage: number,
        items: any[],
    }>({
        items: initBooksResData.items,
        totalItems: initBooksResData.totalItems,
        currentPage: 1
    })
    const [searchTerm, setSearchTerm] = useState<string>(START_SEARCH_TERM)
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


    const paginationHandler = function (event: React.ChangeEvent<any>, page: number) {
        event.preventDefault();
        setBookResData(prev => {
            return { ...prev, currentPage: page }
        })
    }

    const fetchBooks = async (query: string, pageNum: number) => {
        try {
            const booksRes: BooksResInterface = await getBooks(query, pageNum * PAGE_ITEMS);
            setBookResData({items: booksRes.items, totalItems: booksRes.totalItems, currentPage: pageNum})
        } catch(error) {
            setBookResData(prev => { return {...prev, currentPage: 1}})
            console.error(error)
        }
    }

    useEffect(() => {
        if (!debouncedSearchTerm) return
        fetchBooks(debouncedSearchTerm, bookResData.currentPage)
    }, [debouncedSearchTerm, bookResData.currentPage])

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
                            value={searchTerm}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <BookList bookList={bookResData.items} favoriteBookIdList={favoriteBookIdList} handleFavorites={handleFavorites} style={{ marginTop: 20 }} />
            <Pagination onChange={paginationHandler} showFirstButton={true} count={Math.round(bookResData.totalItems/PAGE_ITEMS)} page={bookResData.currentPage} size="large" />
        </Box>
    );
}