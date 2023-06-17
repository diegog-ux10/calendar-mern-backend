const { request, response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req = request, res = response) => {
  const events = await Event.find().populate("user", "name");
  res.status(200).json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    event.user = req.uid;
    const eventDb = await event.save();
    res.json({
      ok: true,
      event: eventDb,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contact page support",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msh: "event with that id doent's exist",
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msh: "You can not update a event that is not yours",
      });
    }
    const newEvent = {
      ...req.body,
      user: uid,
    };
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contact page support",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msh: "event with that id doent's exist",
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msh: "You can not delete a event that is not yours",
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      ok: true,
      deletedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contact page support",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
