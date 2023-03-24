import { Schema, model } from "mongoose";

export const SpellsSchema = new Schema({});

const Spells = model("Spells", SpellsSchema);

export default Spells;
