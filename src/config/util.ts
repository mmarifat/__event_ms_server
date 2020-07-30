export enum FieldTypes {
	Date = 0,
	Text = 1,
	Number = 2,
	Email = 3,
	Phone = 4,
	Currency = 5
}

export enum Status {
	ACTIVE,
	INACTIVE,
	SUSPENDED,
	INVITED,
	APPLIED,
	REGISTERED,
	TERMINATED
}

export enum TimeScheduleType {
	WorkingDay,
	VacationDay,
	SickDay
}

export enum PaymentTermType {
	DAY,
	WEEK,
	MONTH
}

export enum FONT {
	Courier = 'Courier',
	CourierBold = 'Courier-Bold',
	CourierOblique = 'Courier-Oblique',
	CourierBoldOblique = 'Courier-BoldOblique',
	Helvetica = 'Helvetica',
	HelveticaBold = 'Helvetica-Bold',
	HelveticaOblique = 'Helvetica-Oblique',
	HelveticaBoldOblique = 'Helvetica-BoldOblique',
	Symbol = 'Symbol',
	TimesRoman = 'Times-Roman',
	TimesBold = 'Times-Bold',
	TimesItalic = 'Times-Italic',
	TimesBoldItalic = 'Times-BoldItalic',
	ZapfDingbats = 'ZapfDingbats',
}