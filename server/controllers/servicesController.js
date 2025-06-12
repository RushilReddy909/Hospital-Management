import servicesModel from "../models/serviceModel.mjs";

// GET all services
export const getAllServices = async (req, res) => {
  try {
    const services = await servicesModel.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error });
  }
};

// GET a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await servicesModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service", error });
  }
};

// CREATE a new service
export const createService = async (req, res) => {
  try {
    const newService = new servicesModel(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: "Failed to create service", error });
  }
};

// UPDATE a service by ID
export const updateService = async (req, res) => {
  try {
    const updatedService = await servicesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: "Failed to update service", error });
  }
};

// DELETE a service by ID
export const deleteService = async (req, res) => {
  try {
    const deletedService = await servicesModel.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error });
  }
};
