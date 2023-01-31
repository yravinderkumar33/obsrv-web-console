import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDatasets } from "services/dataset";
import { fetchJsonSchema } from "services/json-schema"
export const fetchDataThunk = createAsyncThunk('fetchData', fetchDatasets);
export const fetchJsonSchemaThunk = createAsyncThunk('fetchData', fetchJsonSchema);
export default [fetchDataThunk, fetchJsonSchemaThunk]