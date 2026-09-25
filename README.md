# Product Admin Dashboard

A responsive Product Admin Dashboard built using React, Tailwind CSS, Axios, and the DummyJSON API.

## Tech Stack

* React
* React Router
* Tailwind CSS
* Axios
* DummyJSON API
* Vite
* JavaScript

## Setup


###  Navigate to the project folder

```bash
cd <project-folder-name>
```

### . Install dependencies

```bash
npm install
```

### . Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## Completed Features

### Authentication

* Login page with validation
* Login error handling for invalid credentials
* Protected product routes
* Logout functionality

### Product Management

* Product listing using DummyJSON API
* Responsive desktop table
* Responsive mobile card layout
* Product details page
* Product image gallery
* Product reviews
* Add product
* Edit product
* Delete product
* Loading states
* Error states
* Empty states

### Search and Filtering

* Product search
* Debounced search
* Category filtering
* Sorting by:

  * Price
  * Rating
  * Title
* Ascending and descending sorting

### Pagination

* Pagination using `limit` and `skip`
* Previous and Next buttons
* Page number navigation
* Page size selection:

  * 10 products
  * 20 products
  * 50 products
* Display of current product range and total products

### URL State

* Search state stored in URL query parameters
* Category stored in URL query parameters
* Sorting stored in URL query parameters
* Pagination stored in URL query parameters
* Invalid page handling

### API and Performance

* Axios used for API requests
* Centralized Axios configuration
* Request cancellation using `AbortController`
* Prevents outdated API responses from updating the UI
* Double-submit prevention for Add/Edit operations

### Responsive Design

* Desktop table layout
* Mobile card layout
* Responsive product details page
* Responsive image gallery
* Tailwind CSS utility classes used throughout the application

## API

This project uses the DummyJSON Products API.

```text
https://dummyjson.com/products
```

Main API operations used:

* Get products
* Search products
* Get product categories
* Get products by category
* Get product by ID
* Add product
* Update product
* Delete product

## Important Note

DummyJSON simulates product mutations such as Add, Update, and Delete. These changes may not persist permanently on the server after refreshing the page.

Local storage is used where needed to preserve locally added or updated products during the application session.

## Project Structure

```text
src/
├── api/
│   ├── axios.js
│   └── productApi.js
│
├── components/
│
├── pages/
│   ├── Login.jsx
│   ├── Products.jsx
│   └── ProductDetails.jsx
│
├── App.jsx
├── main.jsx
└── ...
```

## Running the Project

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```
