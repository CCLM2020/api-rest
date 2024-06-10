import { nanoid } from "nanoid";
import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {
    try {
        const links = await Link.find({uid: req.uid});

        return res.json({ ok: 'Links true', links });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'});
    }
};

export const getLink = async (req, res) => {
    try {
        const {id} = req.params;
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({error: 'No existe el link'});

        if (!link.uid.equals(req.uid)) return res.status(401).json({error: 'No pertenece ese id 🤡'});

        return res.json({ ok: 'Link true', link });
    } catch (error) {
        console.log(error);

        if (error.kind === "ObjectId") {
            return res.status(403).json({error: 'Formato id incorrecto'});
        }

        return res.status(500).json({error: 'Error de servidor'});
    }
}

export const removeLink = async (req, res) => {
    try {
        const {id} = req.params;
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({error: 'No existe el link'});

        if (!link.uid.equals(req.uid)) return res.status(401).json({error: 'No pertenece ese id 🤡'});

        await link.deleteOne();

        return res.json({ ok: 'Link remove', link });
    } catch (error) {
        console.log(error);

        if (error.kind === "ObjectId") {
            return res.status(403).json({error: 'Formato id incorrecto'});
        }

        return res.status(500).json({error: 'Error de servidor'});
    }
}
    

export const createLinks = async (req, res) => {
    try {
        const {longLink} = req.body;

        console.log(longLink);

        const link = new Link({longLink, nanoLink: nanoid(10), uid: req.uid});

        const newLink = await link.save();

        return res.status(201).json({ ok: 'Links create', newLink });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Error de servidor'});
    }
};

