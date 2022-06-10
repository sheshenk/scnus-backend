import { unpackSingleDocument, unpackMultipleDocuments } from '../utils/unpackDocument.js'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const model = mongoose.model
const Schema = mongoose.Schema
const schemaTypes = Schema.Types

const MerchantSchema = Schema({
	name: { type: schemaTypes.String, required: true, default: 'Event Merchant' },
	phone: { type: schemaTypes.String, required: true, unique: true }
})

MerchantSchema.plugin(uniqueValidator)

export const MerchantObject = model('Merchant', MerchantSchema)

export const createMerchant = async (merchant) => {
	const { name, phone } = merchant
	const httpResponse = new MerchantObject({ name, phone }).save()
		.then(res => {
			console.log(`New merchant created with id ${res._id}`)
			return { response: res._id }
		})
		.catch(err => {
			return { error: err.code ? err.code : err }
		})
	return httpResponse
}

export const readMerchant = (params) => {
	return MerchantObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => {
			console.log('Error while getting merchant')
		})
}

export const readMerchants = (params) => {
	return MerchantObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => {
			console.log('Error while getting merchants')
		})
}

export const updateMerchant = (query, update) => {
	return MerchantObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => {
			console.log(`Merchant with id ${res._id} updated`)
			return { response: res._id }
		})
		.catch(err => {
			console.log('Error while updating merchant')
			return { error: err.code ? err.code : err }
		})
}